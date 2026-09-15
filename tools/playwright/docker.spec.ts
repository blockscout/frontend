import { describe, expect, it } from 'vitest';

import {
  CONTAINER_PNPM_STORE,
  CONTAINER_WORKDIR,
  DOCKER_IMAGE_NAME,
  DOCKER_IMAGE_OS_SUFFIX,
  LINUX_MODULES_DIR,
  PACKAGE_FILE,
  PLAYWRIGHT_PACKAGE_FILE,
  PNPM_STORE_VOLUME,
} from './config';
import type { DockerOptions } from './docker';
import { buildDockerCommand, buildDockerDepsCommand, resolveDockerOptions } from './docker';

const CWD = '/Users/dev/frontend';
const IMAGE = 'example.test/playwright:v0.0.0-test';
const PNPM_VERSION = '11.0.0';
const OPTIONS: DockerOptions = { tty: false, image: IMAGE, pnpm: PNPM_VERSION };

function scriptOf(args: ReadonlyArray<string>): string {
  const bashIndex = args.indexOf('bash');
  expect(args[bashIndex + 1]).toBe('-c');
  return args[bashIndex + 2];
}

describe('buildDockerCommand', () => {
  it('mounts the repo and the Linux modules, then runs the inner test:pw with the args as "$@"', () => {
    const { command, args } = buildDockerCommand([ 'src/a.pw.tsx', '-g', 'renders the empty state', '--update-snapshots' ], OPTIONS, CWD);

    expect(command).toBe('docker');
    expect(args).toEqual([
      'run', '--rm', '--ipc=host',
      '-v', `${ CWD }:${ CONTAINER_WORKDIR }`,
      '-v', `${ CWD }/${ LINUX_MODULES_DIR }:${ CONTAINER_WORKDIR }node_modules`,
      '-w', CONTAINER_WORKDIR,
      IMAGE,
      'bash', '-c', expect.stringContaining('pnpm test:pw "$@"'),
      'bash', 'src/a.pw.tsx', '-g', 'renders the empty state', '--update-snapshots',
    ]);
  });

  it('activates the pinned pnpm and disables the pre-run dependency check inside the container', () => {
    const script = scriptOf(buildDockerCommand([], OPTIONS, CWD).args);

    expect(script).toBe(
      `corepack enable && corepack prepare pnpm@${ PNPM_VERSION } --activate && PNPM_CONFIG_VERIFY_DEPS_BEFORE_RUN=false pnpm test:pw "$@"`,
    );
  });

  // An agent or CI caller has no terminal; docker with -it would then abort with "the input device is
  // not a TTY".
  it('asks docker for a terminal only when the caller has one', () => {
    expect(buildDockerCommand([], { ...OPTIONS, tty: true }, CWD).args).toContain('-it');
    expect(buildDockerCommand([], { ...OPTIONS, tty: false }, CWD).args).not.toContain('-it');
  });
});

describe('buildDockerDepsCommand', () => {
  // The Linux tree sits at node_modules inside the container, so the repo's postinstall resolves the
  // Linux binaries it just installed rather than the Mac ones.
  it('mounts the repo, the Linux modules over node_modules and the pnpm store volume, then installs', () => {
    const { command, args } = buildDockerDepsCommand({ ...OPTIONS, tty: true }, CWD);

    expect(command).toBe('docker');
    expect(args).toEqual([
      'run', '--rm', '--ipc=host', '-it',
      '-v', `${ CWD }:${ CONTAINER_WORKDIR }`,
      '-v', `${ CWD }/${ LINUX_MODULES_DIR }:${ CONTAINER_WORKDIR }node_modules`,
      '-v', `${ PNPM_STORE_VOLUME }:${ CONTAINER_PNPM_STORE }`,
      '-w', CONTAINER_WORKDIR,
      IMAGE,
      'bash', '-c', expect.any(String),
    ]);

    const script = scriptOf(args);
    expect(script).toContain('apt-get install -y build-essential');
    expect(script).toContain(`corepack prepare pnpm@${ PNPM_VERSION } --activate`);
    expect(script).toContain(`pnpm install --store-dir ${ CONTAINER_PNPM_STORE }`);
    expect(script).not.toContain('--modules-dir');
    expect(script).toContain('CI=true');
  });
});

describe('resolveDockerOptions', () => {
  const files: Record<string, string> = {
    [PLAYWRIGHT_PACKAGE_FILE]: JSON.stringify({ name: '@playwright/test', version: '1.99.0' }),
    [PACKAGE_FILE]: JSON.stringify({ packageManager: 'pnpm@12.3.4' }),
  };
  const readFile = (file: string): string => files[file];

  it('derives the image tag from the installed playwright and the pnpm version from packageManager', () => {
    expect(resolveDockerOptions(readFile, true)).toEqual({
      tty: true,
      image: `${ DOCKER_IMAGE_NAME }:v1.99.0${ DOCKER_IMAGE_OS_SUFFIX }`,
      pnpm: '12.3.4',
    });
  });

  it('rejects a packageManager that is not pnpm', () => {
    const readYarn = (file: string): string => file === PACKAGE_FILE ? JSON.stringify({ packageManager: 'yarn@4.0.0' }) : files[file];

    expect(() => resolveDockerOptions(readYarn, false)).toThrow('must be pnpm@<version>');
  });

  it('rejects a playwright package without a version', () => {
    const readBroken = (file: string): string => file === PLAYWRIGHT_PACKAGE_FILE ? JSON.stringify({ name: '@playwright/test' }) : files[file];

    expect(() => resolveDockerOptions(readBroken, false)).toThrow(`No "version" string in ${ PLAYWRIGHT_PACKAGE_FILE }`);
  });
});
