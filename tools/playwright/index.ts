/* eslint-disable no-console -- this is a CLI whose entire job is to drive playwright and print to stdout */
import { spawnSync } from 'child_process';
import dotenv from 'dotenv';
import fs from 'fs';

import type { FlagSpec } from '../cli/flags';
import { parseArgs as parseFlags } from '../cli/flags';
import { getChangedFiles, resolveBaseCommit } from '../code-complexity/select/diff';
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
import { selectMode } from './select';

// The single entrypoint for Playwright component tests. The tool owns a handful of flags — selection
// and where to run — and hands everything else to `playwright test` as-is. USAGE below is the flag
// reference.

export interface CliOptions {
  baseRef: string;
  diffSelected: boolean;
  docker: boolean;
  dockerDeps: boolean;
  playwrightArgs: Array<string>;
}

const USAGE = `Usage:
  test:pw [<playwright args>...]
      Run the Playwright component tests (*.pw.tsx). Every argument the tool does not own is passed
      to \`playwright test -c ${ PLAYWRIGHT_CONFIG_FILE }\` untouched — --project, --shard, -g, file
      paths, --update-snapshots, --pass-with-no-tests, ...

  test:pw --changed[=<ref>] [--base <ref>] [...]
      Affected mode: run only the tests reachable from the diff vs the base ref (default
      ${ DEFAULT_BASE_REF }, resolved through the merge-base, so uncommitted edits count and
      base-branch churn does not), via Playwright's --only-changed. A change under src/sprite/icons/**,
      playwright/**, ${ PLAYWRIGHT_CONFIG_FILE } or pnpm-lock.yaml runs the whole suite instead.

  test:pw --docker [...]
      Run the same command inside the pinned Playwright image, with the Linux node_modules mounted.
      --docker-deps installs those Linux dependencies (once, before the first --docker run).

  Before every run the tool regenerates ${ ENVS_SCRIPT_FILE } from ${ ENV_FILE } and builds the SVG
  sprite for the ${ SPRITE_APP_ENV } app env. Every run writes playwright-results/report.json next
  to the html (local) or blob (CI) report. The exit code is Playwright's.`;

const FLAGS: ReadonlyMap<string, FlagSpec<CliOptions>> = new Map<string, FlagSpec<CliOptions>>([
  [ '--help', { kind: 'switch', apply: () => {
    console.log(USAGE);
    process.exit(0);
  } } ],
  [ '-h', { kind: 'switch', apply: () => {
    console.log(USAGE);
    process.exit(0);
  } } ],
  [ '--changed', { kind: 'optional', apply: (options, value) => {
    options.diffSelected = true;
    if (value !== undefined) options.baseRef = value;
  } } ],
  [ '--base', { kind: 'value', apply: (options, value) => {
    options.diffSelected = true;
    options.baseRef = value;
  } } ],
  [ '--docker', { kind: 'switch', apply: (options) => {
    options.docker = true;
  } } ],
  [ '--docker-deps', { kind: 'switch', apply: (options) => {
    options.dockerDeps = true;
  } } ],
]);

export function parseArgs(argv: ReadonlyArray<string>): CliOptions {
  const { options, rest } = parseFlags<CliOptions>(argv, FLAGS, {
    baseRef: DEFAULT_BASE_REF,
    diffSelected: false,
    docker: false,
    dockerDeps: false,
    playwrightArgs: [],
  }, { kind: 'passthrough' });

  options.playwrightArgs = rest;
  return options;
}

// A flag the parser knows but the tool cannot honour yet must fail loudly: passing it through would
// let `playwright test` reject it with an error about the wrong program.
function rejectUnimplemented(options: CliOptions): void {
  if (options.docker || options.dockerDeps) throw new Error('--docker / --docker-deps are not implemented yet');
}

type ProcessEnv = typeof process.env;

export interface Step {
  readonly command: string;
  readonly args: ReadonlyArray<string>;
  readonly env: ProcessEnv;
}

export interface BranchChanges {
  readonly baseCommit: string;
  readonly changedFiles: ReadonlyArray<string>;
}

// The process boundary, injected so index.spec.ts can record the steps instead of running them.
export interface Runtime {
  readonly spawn: (step: Step) => number;
  readonly readFile: (file: string) => string;
  readonly changes: (baseRef: string) => BranchChanges;
}

const DEFAULT_RUNTIME: Runtime = {
  spawn: (step) => {
    const result = spawnSync(step.command, step.args, { stdio: 'inherit', env: step.env });
    if (result.error) throw result.error;
    return result.status ?? 1;
  },
  readFile: (file) => fs.readFileSync(file, 'utf8'),
  changes: (baseRef) => {
    const baseCommit = resolveBaseCommit(baseRef, process.cwd());
    return { baseCommit, changedFiles: getChangedFiles(baseCommit, process.cwd()) };
  },
};

// A variable already in the shell wins over the file's value, as it did under dotenv-cli.
function loadEnvFile(runtime: Runtime, shellEnv: ProcessEnv): ProcessEnv {
  return { ...dotenv.parse(runtime.readFile(ENV_FILE)), ...shellEnv };
}

// The Playwright args --changed adds after the user's own. An empty diff still goes through
// --only-changed — Playwright then selects nothing and the caller's --pass-with-no-tests decides the
// exit code — so a local run and a CI run of the same branch behave the same.
export function selectionArgs(options: CliOptions, runtime: Runtime): Array<string> {
  if (!options.diffSelected) return [];

  const { baseCommit, changedFiles } = runtime.changes(options.baseRef);
  const mode = selectMode(changedFiles);
  if (mode.kind === 'full') {
    console.log(`Running the full suite: ${ mode.forcedBy } changed`);
    return [];
  }
  return [ `--only-changed=${ baseCommit }` ];
}

// The three children in order: the envs script, the sprite, then Playwright itself. The sprite and
// Playwright run under the pw app env; the envs script does not, so envs.js keeps the app env the
// file declares.
export function buildSteps(options: CliOptions, env: ProcessEnv, extraPlaywrightArgs: ReadonlyArray<string>): Array<Step> {
  const spriteEnv = { ...env, NEXT_PUBLIC_APP_ENV: SPRITE_APP_ENV };
  return [
    { command: MAKE_ENVS_SCRIPT, args: [ ENVS_SCRIPT_FILE ], env },
    { command: 'pnpm', args: [ 'svg:build-sprite' ], env: spriteEnv },
    {
      command: PLAYWRIGHT_BIN,
      args: [ 'test', '-c', PLAYWRIGHT_CONFIG_FILE, ...options.playwrightArgs, ...extraPlaywrightArgs ],
      env: { ...spriteEnv, NODE_OPTIONS: PLAYWRIGHT_NODE_OPTIONS },
    },
  ];
}

export function run(argv: ReadonlyArray<string>, runtime: Runtime = DEFAULT_RUNTIME): number {
  const options = parseArgs(argv);
  rejectUnimplemented(options);
  const extraPlaywrightArgs = selectionArgs(options, runtime);

  /* eslint-disable-next-line no-restricted-properties -- a Node CLI forwarding its own shell env to the children it spawns */
  const env = loadEnvFile(runtime, process.env);

  // The old runner deleted Playwright's CT build cache before every run, paying a cold bundle each
  // time. Playwright's own cache invalidation has been reliable, so the step is off; re-enable it if
  // a stale CT build is ever observed.
  // fs.rmSync(PLAYWRIGHT_CACHE_DIR, { recursive: true, force: true });

  for (const step of buildSteps(options, env, extraPlaywrightArgs)) {
    const status = runtime.spawn(step);
    if (status !== 0) return status;
  }
  return 0;
}

// run.sh always executes the compiled entry point, so that path is what marks this module as the
// process entry. The guard exists so index.spec.ts can import the module without starting a run —
// under vitest the entry is vitest's own binary.
const CLI_ENTRY_PATH = 'playwright/dist/playwright/index.js';

function isProcessEntryPoint(): boolean {
  const entry = process.argv[1]?.replace(/\\/g, '/');
  return entry !== undefined && entry.endsWith(CLI_ENTRY_PATH);
}

if (isProcessEntryPoint()) {
  try {
    process.exitCode = run(process.argv.slice(2));
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
