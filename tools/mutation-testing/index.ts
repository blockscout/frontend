/* eslint-disable no-console -- this is a CLI whose entire job is to print a report to stdout */
import { DEFAULT_BASE_REF } from './config';
import { formatTable } from './render/table';
import type { Selection } from './select/files';
import { selectFiles } from './select/files';
import { runStryker } from './stryker/invoke';
import { buildFileScores, readReport } from './stryker/report';

// Mutation testing: change the code, and see whether any test notices. Coverage answers "was this
// line executed?"; a surviving mutant answers "would a bug here be caught?", which is the question
// this tool exists to ask.
//
// Selection has three modes, mirroring the complexity gate's flags; ./select/files.ts owns them.
// USAGE below is the flag reference.

interface CliOptions {
  baseRef: string;
  diffSelected: boolean;
  focusPaths: Array<string>;
}

const USAGE = `Usage:
  test:mutation-testing
      Full mode (default): mutate every in-scope file that has a co-located vitest spec.

  test:mutation-testing <path...>
      Focused mode: mutate the given files. A file with no spec beside it is skipped.

  test:mutation-testing --changed[=<ref>] [--base <ref>]
      Diff mode: mutate only the lines this branch changed vs the base ref
      (default ${ DEFAULT_BASE_REF }, resolved through the merge-base, so uncommitted edits count and
      base-branch churn does not).

  A file is mutated only when a vitest spec sits beside it (X.spec.ts / X.spec.tsx next to X.ts /
  X.tsx) — an untested file would otherwise produce a run of unkillable mutants. In every mode, the
  lines inside a jsx render body are left alone. When the selection comes out empty the run says why
  and exits 0 without starting Stryker.`;

// One flag's behaviour, discriminated by how it takes its value:
//   'switch'   — no value at all
//   'value'    — required, from `--flag=value` or the following token (--base)
//   'optional' — inline-only and optional (--changed[=<ref>]); a bare --changed keeps the default
//                ref, and the flag must never swallow the following token, which in CI is another flag
type FlagSpec =
  { readonly kind: 'switch'; readonly apply: (options: CliOptions) => void } |
  { readonly kind: 'value'; readonly apply: (options: CliOptions, value: string) => void } |
  { readonly kind: 'optional'; readonly apply: (options: CliOptions, value: string | undefined) => void };

// The whole flag surface as data, following the complexity gate's table: a lookup rather than an
// if/else chain, which removes the prefix-shadowing hazard a `startsWith` chain has.
const FLAGS: ReadonlyMap<string, FlagSpec> = new Map<string, FlagSpec>([
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
]);

// Split a token into its flag name and inline value: `--flag=value` splits at the first `=`, a bare
// `--flag` has no inline value.
function splitFlag(arg: string): { readonly name: string; readonly inline: string | undefined } {
  const equals = arg.indexOf('=');
  if (equals === -1) return { name: arg, inline: undefined };
  return { name: arg.slice(0, equals), inline: arg.slice(equals + 1) };
}

// Apply one argv token to `options`, returning how many tokens it consumed — 2 when a value flag
// took the following token, 1 otherwise.
function applyArg(arg: string, next: string | undefined, options: CliOptions): number {
  if (!arg.startsWith('-')) {
    options.focusPaths.push(arg);
    return 1;
  }

  const { name, inline } = splitFlag(arg);
  const spec = FLAGS.get(name);
  if (spec === undefined) throw new Error(`Unknown flag: ${ name }\n${ USAGE }`);

  if (spec.kind === 'optional') {
    spec.apply(options, inline);
    return 1;
  }
  if (spec.kind === 'switch') {
    if (inline !== undefined) throw new Error(`${ name } takes no value`);
    spec.apply(options);
    return 1;
  }

  const value = inline ?? next;
  if (value === undefined) throw new Error(`Missing value for ${ name }`);
  spec.apply(options, value);
  return inline === undefined ? 2 : 1;
}

export function parseArgs(argv: ReadonlyArray<string>): CliOptions {
  const options: CliOptions = {
    baseRef: DEFAULT_BASE_REF,
    diffSelected: false,
    focusPaths: [],
  };

  let index = 0;
  while (index < argv.length) {
    index += applyArg(argv[index], argv[index + 1], options);
  }

  return options;
}

function reportSelection(selection: Extract<Selection, { outcome: 'selected' }>): void {
  for (const file of selection.ineligible) {
    console.error(`› skipped ${ file }: no co-located vitest spec`);
  }
  console.error(`› Mutating ${ selection.targets.length } file(s)…`);
}

function main(): void {
  const options = parseArgs(process.argv.slice(2));
  const selection = selectFiles(options);

  if (selection.outcome === 'empty') {
    console.log(selection.reason);
    return;
  }

  reportSelection(selection);
  runStryker(selection.targets);
  console.log(formatTable(buildFileScores(readReport())));
}

// run.sh always executes the compiled entry point, so that path is what marks this module as the
// process entry. The guard exists so index.spec.ts can import parseArgs without kicking off a whole
// mutation run — under vitest the entry is vitest's own binary.
const CLI_ENTRY_PATH = 'mutation-testing/dist/mutation-testing/index.js';

function isProcessEntryPoint(): boolean {
  const entry = process.argv[1]?.replace(/\\/g, '/');
  return entry !== undefined && entry.endsWith(CLI_ENTRY_PATH);
}

if (isProcessEntryPoint()) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
