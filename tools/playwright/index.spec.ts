import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  DEFAULT_BASE_REF,
  ENV_FILE,
  ENVS_SCRIPT_FILE,
  MAKE_ENVS_SCRIPT,
  PLAYWRIGHT_BIN,
  PLAYWRIGHT_CONFIG_FILE,
  PLAYWRIGHT_NODE_OPTIONS,
  SPRITE_APP_ENV,
} from './config';
import type { Runtime, Step } from './index';
import { parseArgs, run } from './index';

const ENV_FILE_CONTENT = 'NEXT_PUBLIC_FROM_FILE=file\nNEXT_PUBLIC_APP_ENV=testing\n';

// A runtime that records every step and answers each with the next status from the list, 0 once
// the list runs out.
function recordingRuntime(statuses: ReadonlyArray<number> = []): Runtime & { readonly steps: Array<Step>; readonly reads: Array<string> } {
  const steps: Array<Step> = [];
  const reads: Array<string> = [];
  const pending = [ ...statuses ];
  return {
    steps,
    reads,
    spawn: (step) => {
      steps.push(step);
      return pending.shift() ?? 0;
    },
    readFile: (file) => {
      reads.push(file);
      return ENV_FILE_CONTENT;
    },
  };
}

describe('parseArgs', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('defaults to a plain run with nothing to pass through', () => {
    expect(parseArgs([])).toEqual({
      baseRef: DEFAULT_BASE_REF,
      diffSelected: false,
      docker: false,
      dockerDeps: false,
      playwrightArgs: [],
    });
  });

  // The whole point of the tool: whatever it does not own reaches playwright in the order given,
  // with a multi-word value staying one token.
  it('passes unknown flags and positionals through in argv order', () => {
    const argv = [ 'src/a.pw.tsx', '--project=default', '-g', 'renders the empty state', '--update-snapshots', 'src/b.pw.tsx' ];
    expect(parseArgs(argv).playwrightArgs).toEqual(argv);
  });

  it('splits its own flags off from the pass-through list', () => {
    expect(parseArgs([ '--changed', '--project=default', '--base', 'upstream/main', 'src/a.pw.tsx' ])).toEqual({
      baseRef: 'upstream/main',
      diffSelected: true,
      docker: false,
      dockerDeps: false,
      playwrightArgs: [ '--project=default', 'src/a.pw.tsx' ],
    });
  });

  it('selects diff mode from --changed, with an optional inline ref', () => {
    expect(parseArgs([ '--changed' ])).toMatchObject({ diffSelected: true, baseRef: DEFAULT_BASE_REF });
    expect(parseArgs([ '--changed=upstream/main' ])).toMatchObject({ diffSelected: true, baseRef: 'upstream/main' });
  });

  // The CI invocation: --changed must not consume the following token as its ref.
  it('leaves the token after a bare --changed alone', () => {
    expect(parseArgs([ '--changed', '--project=mobile' ])).toMatchObject({
      baseRef: DEFAULT_BASE_REF,
      playwrightArgs: [ '--project=mobile' ],
    });
  });

  it('takes the docker switches', () => {
    expect(parseArgs([ '--docker' ])).toMatchObject({ docker: true, dockerDeps: false });
    expect(parseArgs([ '--docker-deps' ])).toMatchObject({ docker: false, dockerDeps: true });
  });

  it('prints the usage text and exits on --help', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    vi.spyOn(process, 'exit').mockImplementation((code) => {
      throw new Error(`exited with ${ code }`);
    });

    expect(() => parseArgs([ '--help' ])).toThrow('exited with 0');
    expect(log).toHaveBeenCalledWith(expect.stringContaining('Usage:'));
    expect(log).toHaveBeenCalledWith(expect.stringContaining('--changed[=<ref>]'));
    expect(log).toHaveBeenCalledWith(expect.stringContaining('--docker-deps'));
  });
});

describe('run', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('runs the envs script, the sprite build, then playwright with the pass-through args', () => {
    const runtime = recordingRuntime();

    run([ 'src/a.pw.tsx', '-g', 'renders the empty state' ], runtime);

    expect(runtime.reads).toEqual([ ENV_FILE ]);
    expect(runtime.steps.map((step) => [ step.command, ...step.args ])).toEqual([
      [ MAKE_ENVS_SCRIPT, ENVS_SCRIPT_FILE ],
      [ 'pnpm', 'svg:build-sprite' ],
      [ PLAYWRIGHT_BIN, 'test', '-c', PLAYWRIGHT_CONFIG_FILE, 'src/a.pw.tsx', '-g', 'renders the empty state' ],
    ]);
  });

  // The sprite and playwright need the pw app env; the envs script must not see it, or envs.js
  // would carry a different app env than the file declares.
  it('gives every child the env file, and only the sprite and playwright the pw app env', () => {
    const runtime = recordingRuntime();

    run([], runtime);

    const [ envsStep, spriteStep, playwrightStep ] = runtime.steps;
    expect(envsStep.env).toMatchObject({ NEXT_PUBLIC_FROM_FILE: 'file', NEXT_PUBLIC_APP_ENV: 'testing' });
    expect(spriteStep.env).toMatchObject({ NEXT_PUBLIC_FROM_FILE: 'file', NEXT_PUBLIC_APP_ENV: SPRITE_APP_ENV });
    expect(playwrightStep.env).toMatchObject({
      NEXT_PUBLIC_FROM_FILE: 'file',
      NEXT_PUBLIC_APP_ENV: SPRITE_APP_ENV,
      NODE_OPTIONS: PLAYWRIGHT_NODE_OPTIONS,
    });
    expect(envsStep.env.NODE_OPTIONS).toBeUndefined();
    expect(spriteStep.env.NODE_OPTIONS).toBeUndefined();
  });

  it('lets a variable already in the shell win over the env file', () => {
    vi.stubEnv('NEXT_PUBLIC_FROM_FILE', 'shell');
    const runtime = recordingRuntime();

    run([], runtime);

    expect(runtime.steps[0].env.NEXT_PUBLIC_FROM_FILE).toBe('shell');
  });

  it('returns playwright\'s exit code', () => {
    expect(run([], recordingRuntime([ 0, 0, 0 ]))).toBe(0);
    expect(run([], recordingRuntime([ 0, 0, 1 ]))).toBe(1);
  });

  it('stops at the first failing pre-run step and returns its status', () => {
    const runtime = recordingRuntime([ 0, 2 ]);

    expect(run([], runtime)).toBe(2);
    expect(runtime.steps).toHaveLength(2);
  });

  it('rejects the flags that are not implemented yet before running anything', () => {
    const runtime = recordingRuntime();

    expect(() => run([ '--changed' ], runtime)).toThrow('--changed / --base are not implemented yet');
    expect(() => run([ '--base=main' ], runtime)).toThrow('--changed / --base are not implemented yet');
    expect(() => run([ '--docker' ], runtime)).toThrow('--docker / --docker-deps are not implemented yet');
    expect(() => run([ '--docker-deps' ], runtime)).toThrow('--docker / --docker-deps are not implemented yet');
    expect(runtime.steps).toHaveLength(0);
  });
});
