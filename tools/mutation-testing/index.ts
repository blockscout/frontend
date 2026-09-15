/* eslint-disable no-console -- this is a CLI whose entire job is to print a report to stdout */
import fs from 'fs';
import { pathToFileURL } from 'url';

import type { FlagSpec } from '../cli/flags';
import { parseArgs as parseFlags } from '../cli/flags';
import { DEFAULT_BASE_REF, DEFAULT_BUDGET_MS, HTML_REPORT_FILE, MINUTE_MS } from './config';
import { formatFindings } from './render/findings';
import { githubAnnotations, stepSummary, truncationAnnotation } from './render/github';
import { formatTable } from './render/table';
import { formatTruncationNotice } from './render/truncation';
import type { MutateTarget, Selection } from './select/files';
import { selectFiles } from './select/files';
import type { RunOutcome } from './stryker/invoke';
import { runStryker } from './stryker/invoke';
import type { Findings } from './stryker/report';
import { buildFileScores, collectFindings, isFailingRun } from './stryker/report';
import type { RunResults } from './stryker/results';
import { readResults, testedNothing } from './stryker/results';

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
  budgetMs: number;
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

  --budget <minutes>
      Wall-clock bound on the run (default ${ DEFAULT_BUDGET_MS / MINUTE_MS }). At expiry the run is
      stopped and everything tested so far is reported, marked as truncated.

  A file is mutated only when a vitest spec sits beside it (X.spec.ts / X.spec.tsx next to X.ts /
  X.tsx) — an untested file would otherwise produce a run of unkillable mutants. In every mode, the
  lines inside a jsx render body are left alone. When the selection comes out empty the run says why
  and exits 0 without starting Stryker.`;

// Two readers, two places. A local run is read in the terminal it was started from; a CI run is read
// on the run page, where the log sits behind a click and shares the job with checkout and install
// output. $GITHUB_STEP_SUMMARY is absent in Actions runtimes that provide no summary file.
/* eslint-disable no-restricted-properties -- a Node CLI reading its own CI runtime, not app env vars */
const IN_GITHUB_ACTIONS = Boolean(process.env.GITHUB_ACTIONS);
const STEP_SUMMARY_FILE = process.env.GITHUB_STEP_SUMMARY;
/* eslint-enable no-restricted-properties */

// A budget of zero or less would stop the run before it started, and a misspelt value must not
// silently fall back to the default — either way the flag would lie about what bounds the run.
function parseBudgetMinutes(value: string): number {
  const minutes = Number(value);
  if (!Number.isFinite(minutes) || minutes <= 0) throw new Error(`--budget takes a positive number of minutes, got: ${ value }`);
  return minutes;
}

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
  [ '--budget', { kind: 'value', apply: (options, value) => {
    options.budgetMs = parseBudgetMinutes(value) * MINUTE_MS;
  } } ],
]);

export function parseArgs(argv: ReadonlyArray<string>): CliOptions {
  const { options, rest } = parseFlags<CliOptions>(argv, FLAGS, {
    baseRef: DEFAULT_BASE_REF,
    diffSelected: false,
    focusPaths: [],
    budgetMs: DEFAULT_BUDGET_MS,
  }, { kind: 'reject', usage: USAGE });

  options.focusPaths = rest;
  return options;
}

function reportSelection(selection: Extract<Selection, { outcome: 'selected' }>): void {
  for (const file of selection.ineligible) {
    console.error(`› skipped ${ file }: no co-located vitest spec`);
  }
  console.error(`› Mutating ${ selection.targets.length } file(s)…`);
}

// Stryker writes the html report only when a whole run finishes, and ./stryker/invoke.ts deletes the
// previous one before starting — so the file existing is what makes the path this run's rather than
// a stale one being advertised as fresh. Only a local reader can open the path: on a runner it names
// a workspace that is gone by the time anyone reads the log.
function reportHtmlLocation(): void {
  if (!fs.existsSync(HTML_REPORT_FILE)) return;
  console.log(`\nFull report: ${ pathToFileURL(HTML_REPORT_FILE).href }`);
}

function formatReport(results: RunResults, findings: Findings, budgetMs: number): string {
  const sections = [ formatTable(buildFileScores(results.report)) ];
  if (results.truncated) sections.push(formatTruncationNotice(results, budgetMs));
  sections.push(formatFindings(findings));
  return sections.join('\n\n');
}

// Stryker narrates its own run — instrumentation counts, worker setup, report paths — through this
// process's inherited stdio, so in CI that lands between the selection line and the report. A log
// group folds it away instead of silencing it: when Stryker fails, its output is the diagnosis.
async function runGrouped(targets: ReadonlyArray<MutateTarget>, budgetMs: number): Promise<RunOutcome> {
  if (!IN_GITHUB_ACTIONS) return runStryker(targets, budgetMs);

  console.log('::group::Stryker output');
  try {
    return await runStryker(targets, budgetMs);
  } finally {
    console.log('::endgroup::');
  }
}

// Under $GITHUB_ACTIONS, repeat the findings as annotation directives so they land on the PR diff.
// The plain-stdout report has already been printed, and is what a local run reads.
function emitGithubActionsOutput(findings: Findings, results: RunResults, budgetMs: number): void {
  for (const annotation of githubAnnotations(findings)) console.log(annotation);
  if (results.truncated) console.log(truncationAnnotation(formatTruncationNotice(results, budgetMs)));
}

function writeStepSummary(report: string): void {
  if (STEP_SUMMARY_FILE === undefined) return;
  fs.appendFileSync(STEP_SUMMARY_FILE, stepSummary(report));
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const selection = selectFiles(options, process.cwd());

  if (selection.outcome === 'empty') {
    console.log(selection.reason);
    return;
  }

  reportSelection(selection);
  const results = readResults(await runGrouped(selection.targets, options.budgetMs));
  const findings = collectFindings(results.report);

  const report = formatReport(results, findings, options.budgetMs);
  console.log(report);

  if (IN_GITHUB_ACTIONS) {
    emitGithubActionsOutput(findings, results, options.budgetMs);
    writeStepSummary(report);
  } else {
    reportHtmlLocation();
  }

  if (isFailingRun(findings) || testedNothing(results)) process.exitCode = 1;
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
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
