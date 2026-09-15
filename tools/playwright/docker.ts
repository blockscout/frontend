import path from 'path';

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

export interface DockerOptions {
  readonly tty: boolean;
  readonly image: string;
  readonly pnpm: string;
}

export interface DockerCommand {
  readonly command: 'docker';
  readonly args: Array<string>;
}

// The Playwright image ships Node but not pnpm; corepack activates the version package.json pins.
function pnpmSetup(pnpm: string): string {
  return `corepack enable && corepack prepare pnpm@${ pnpm } --activate`;
}

// The Linux tree was installed from a bind mount, so its recorded paths differ from what pnpm's
// pre-run check expects and it would refuse to start a script.
const INNER_TEST_ENV = 'PNPM_CONFIG_VERIFY_DEPS_BEFORE_RUN=false';

// Build tools for the native dependencies the Linux tree compiles on install.
const BUILD_TOOLS_INSTALL = [
  'apt-get update',
  'apt-get install -y build-essential python3 cmake pkg-config libssl-dev',
  'rm -rf /var/lib/apt/lists/*',
].join(' && ');

// CI=true keeps pnpm 11 from prompting to purge the modules dir.
const LINUX_DEPS_INSTALL = [
  'export npm_config_build_from_source=false npm_config_prefer_offline=true CI=true',
  `pnpm install --store-dir ${ CONTAINER_PNPM_STORE } --config.confirm-modules-purge=true`,
].join(' && ');

function dockerRunArgs(options: DockerOptions, cwd: string, mounts: ReadonlyArray<string>): Array<string> {
  return [
    'run', '--rm', '--ipc=host',
    ...(options.tty ? [ '-it' ] : []),
    '-v', `${ cwd }:${ CONTAINER_WORKDIR }`,
    ...mounts.flatMap((mount) => [ '-v', mount ]),
    '-w', CONTAINER_WORKDIR,
    options.image,
  ];
}

function linuxModulesMount(cwd: string): string {
  return `${ path.join(cwd, LINUX_MODULES_DIR) }:${ path.posix.join(CONTAINER_WORKDIR, 'node_modules') }`;
}

// The inner command is `bash -c '<script>' bash <args...>`: the args reach the script as "$@", so a
// test title with spaces or a shell metacharacter never goes through a second round of quoting.
export function buildDockerCommand(args: ReadonlyArray<string>, options: DockerOptions, cwd: string = process.cwd()): DockerCommand {
  const script = `${ pnpmSetup(options.pnpm) } && ${ INNER_TEST_ENV } pnpm test:pw "$@"`;
  return {
    command: 'docker',
    args: [ ...dockerRunArgs(options, cwd, [ linuxModulesMount(cwd) ]), 'bash', '-c', script, 'bash', ...args ],
  };
}

// The Linux tree is mounted over node_modules for the install as well, rather than installed with
// --modules-dir: the repo's postinstall (chakra typegen) resolves esbuild from ./node_modules, and with
// the Mac tree there it loads the darwin binary and fails.
export function buildDockerDepsCommand(options: DockerOptions, cwd: string = process.cwd()): DockerCommand {
  const storeMount = `${ PNPM_STORE_VOLUME }:${ CONTAINER_PNPM_STORE }`;
  const script = `${ BUILD_TOOLS_INSTALL } && ${ pnpmSetup(options.pnpm) } && ${ LINUX_DEPS_INSTALL }`;
  return {
    command: 'docker',
    args: [ ...dockerRunArgs(options, cwd, [ linuxModulesMount(cwd), storeMount ]), 'bash', '-c', script ],
  };
}

function fieldOf(json: string, field: string, file: string): string {
  const parsed: unknown = JSON.parse(json);
  const value = typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, unknown>)[field] : undefined;
  if (typeof value !== 'string') throw new Error(`No "${ field }" string in ${ file }`);
  return value;
}

function pnpmVersionOf(packageManager: string): string {
  const match = /^pnpm@(\S+)$/.exec(packageManager);
  if (match === null) throw new Error(`"packageManager" in ${ PACKAGE_FILE } must be pnpm@<version>, got ${ packageManager }`);
  return match[1];
}

// Neither version is written into the tool: a Playwright upgrade moves the image with it, a pnpm
// bump moves what corepack activates.
export function resolveDockerOptions(readFile: (file: string) => string, tty: boolean): DockerOptions {
  const playwrightVersion = fieldOf(readFile(PLAYWRIGHT_PACKAGE_FILE), 'version', PLAYWRIGHT_PACKAGE_FILE);
  return {
    tty,
    image: `${ DOCKER_IMAGE_NAME }:v${ playwrightVersion }${ DOCKER_IMAGE_OS_SUFFIX }`,
    pnpm: pnpmVersionOf(fieldOf(readFile(PACKAGE_FILE), 'packageManager', PACKAGE_FILE)),
  };
}
