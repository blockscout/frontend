/* eslint-disable no-console -- this is a CLI whose entire job is to print a JSON report to stdout */
import fs from 'fs';
import path from 'path';

import { TypeSafeClient, TypeSafeError } from '@typesafe-ai/sdk';

import type { FlagSpec } from '../cli/flags';
import { parseArgs as parseFlags } from '../cli/flags';
import {
  CONCURRENT_REQUESTS, CONTEXT_LINES, DEFAULT_STANDARDS_THRESHOLD, MAX_CHANGED_LINES_PER_WINDOW, MAX_STATE_CHARS, MAX_SUSPECTS, MODEL,
  SIDECAR_DIR, SPEC_GRID_EXCLUDE, SPEC_THRESHOLD, STANDARDS_THRESHOLD_OVERRIDES,
} from './config';
import type { CallRecord, ScreenClient } from './grid/shared';
import type { SpecResult } from './grid/spec';
import { screenSpec, shareCap, specGridFiles } from './grid/spec';
import type { StandardsResult } from './grid/standards';
import { screenStandards } from './grid/standards';
import type { SuspectFateRecord } from './origins/match';
import { assignOrigins } from './origins/match';
import { formatSuspectRef, parseOriginsInput } from './origins/parse';
import { RULES } from './rubric';
import type { Change, Scope } from './select/change';
import { resolveChange } from './select/change';
import type { FileWindows } from './select/hunks';
import { buildWindows, readHunks } from './select/hunks';
import type { SpecSource } from './select/spec';
import { readSpec } from './select/spec';
import type { RunStatus, SidecarRecord, SpecRecord } from './sidecar';
import { readSidecar, resolveMainCheckout, sidecarFileName, windowSpans, writeSidecar } from './sidecar';

// The screen never fails a review: a missing key or an API error still exits 0, with the status and
// reason in the JSON, and every run writes its sidecar. Only a bug in the tool itself exits non-zero.

export interface CliOptions {
  scope: Scope;
  base: string | undefined;
  spec: string | undefined;
  ticket: string | undefined;
  origins: string | undefined;
  findings: string | undefined;
  calibration: boolean;
}

const STDIN = '-';

const USAGE = `Usage:
  review:screen [--scope branch|uncommitted] [--base <ref>] [--spec <path>] [--ticket <NN>]
  review:screen --origins <sidecar> --findings <path|->

  Screens a change with Jev — every rubric rule against every touched file, and, when the change has
  a task spec, every Functional Requirement against every touched file — and prints the suspects as
  JSON on stdout. Every run writes a sidecar with every cell score to <main checkout>/.ai/jev/.

  --scope branch       (default) diff from the merge-base with main; untracked files included
  --scope uncommitted  diff HEAD against the working tree; untracked files included
  --base <ref>         use this base verbatim instead of deriving it from the scope
  --spec <path>        use this task spec verbatim instead of resolving it from the issue branch
  --ticket <NN>        name the ticket in the sidecar file; under --scope uncommitted it defaults to
                       the first unchecked box in the task's progress.md
  --calibration        mark the sidecar as a calibration run (a past diff screened to tune the
                       thresholds), so --report leaves it out of the pilot's numbers

  Without TYPESAFE_API_KEY in the environment the run is skipped; an API failure is reported as failed.
  Both exit 0.

  --origins <sidecar>  after the review is published: record each suspect's fate and each finding's
                       origin (axis | jev | both) into that sidecar, replacing any earlier record
  --findings <path|->  the review's final findings and the jev axis's drop list, as a JSON array or as
                       Markdown tables; - reads stdin
                         finding: { id, axis, location: "<path>:<line>" | "FR<n>" | "—", sources: [...] }
                         drop:    { suspect: "<rule> <path>:<line>" | "FR<n>", fate: "dropped", reason }
                         tables:  | id | axis | location | sources |   and   | suspect | fate | reason |`;

function readScope(raw: string): Scope {
  if (raw === 'branch' || raw === 'uncommitted') return raw;
  throw new Error(`Invalid value for --scope: ${ raw }\n${ USAGE }`);
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
  [ '--scope', { kind: 'value', apply: (options, value) => {
    options.scope = readScope(value);
  } } ],
  [ '--base', { kind: 'value', apply: (options, value) => {
    options.base = value;
  } } ],
  [ '--spec', { kind: 'value', apply: (options, value) => {
    options.spec = value;
  } } ],
  [ '--ticket', { kind: 'value', apply: (options, value) => {
    options.ticket = value;
  } } ],
  [ '--origins', { kind: 'value', apply: (options, value) => {
    options.origins = value;
  } } ],
  [ '--findings', { kind: 'value', apply: (options, value) => {
    options.findings = value;
  } } ],
  [ '--calibration', { kind: 'switch', apply: (options) => {
    options.calibration = true;
  } } ],
]);

export function parseArgs(argv: ReadonlyArray<string>): CliOptions {
  const { options, rest } = parseFlags<CliOptions>(argv, FLAGS, {
    scope: 'branch',
    base: undefined,
    spec: undefined,
    ticket: undefined,
    origins: undefined,
    findings: undefined,
    calibration: false,
  }, { kind: 'reject', usage: USAGE });
  if (rest.length > 0) throw new Error(`Unexpected argument: ${ rest[0] }\n${ USAGE }`);
  if ((options.origins === undefined) !== (options.findings === undefined)) throw new Error(`--origins and --findings go together\n${ USAGE }`);
  return options;
}

type ClientOutcome =
  { readonly ok: true; readonly client: ScreenClient } |
  { readonly ok: false; readonly reason: string };

// The SDK reads the key itself; a missing one surfaces as the constructor throwing, which is the
// `skipped` outcome rather than a crash.
function createClient(): ClientOutcome {
  try {
    return { ok: true, client: new TypeSafeClient({ defaultModel: MODEL }) };
  } catch (error) {
    if (error instanceof TypeSafeError) return { ok: false, reason: error.message };
    throw error;
  }
}

function windowsOf(change: Change, cwd: string): Array<FileWindows> {
  const limits = { maxChars: MAX_STATE_CHARS, maxChangedLines: MAX_CHANGED_LINES_PER_WINDOW };
  return change.files
    .map((file) => ({ file: file.path, windows: buildWindows(readHunks(file.path, file.untracked, change.base, CONTEXT_LINES, cwd), limits) }))
    .filter((target) => target.windows.length > 0);
}

const EMPTY_STANDARDS: StandardsResult = { cells: [], suspects: [], cut: 0, calls: [], model: undefined, failure: undefined };
const EMPTY_SPEC: SpecResult = { cells: [], suspects: [], cut: 0, calls: [], model: undefined, failure: undefined };

interface Screened {
  readonly client: ClientOutcome;
  readonly source: SpecSource;
  readonly windows: ReadonlyArray<FileWindows>;
  readonly standards: StandardsResult;
  readonly spec: SpecResult;
}

function statusOf(screened: Screened): { readonly status: RunStatus; readonly reason: string | undefined } {
  if (!screened.client.ok) return { status: 'skipped', reason: screened.client.reason };
  const failure = screened.standards.failure ?? screened.spec.failure;
  if (failure !== undefined) return { status: 'failed', reason: failure };
  return { status: 'ok', reason: undefined };
}

function specRecordOf(screened: Screened): SpecRecord {
  const { client, source, spec } = screened;
  if (source.status !== 'ok') return source.status === 'no-spec' ? source : { status: 'failed', reason: source.reason, requirements: [], cells: [] };
  if (!client.ok) return { status: 'skipped', reason: client.reason };
  if (spec.failure !== undefined) return { status: 'failed', reason: spec.failure, requirements: source.requirements, cells: spec.cells };
  return { status: 'ok', requirements: source.requirements, cells: spec.cells, suspects: spec.suspects, cut: spec.cut };
}

function buildRecord(change: Change, screened: Screened, calibration: boolean): SidecarRecord {
  const calls: Array<CallRecord> = [ ...screened.standards.calls, ...screened.spec.calls ];
  return {
    version: 1,
    createdAt: new Date().toISOString(),
    ...statusOf(screened),
    calibration,
    model: screened.standards.model ?? screened.spec.model,
    inputs: { scope: change.scope, base: change.base, branch: change.branch, ticket: change.ticket, spec: change.spec, files: change.files },
    windows: windowSpans(screened.windows),
    standards: { cells: screened.standards.cells, suspects: screened.standards.suspects, cut: screened.standards.cut },
    spec: specRecordOf(screened),
    calls,
    origins: undefined,
  };
}

// The two grids run one after the other so a single pool bounds the request rate, and the cap is
// shared once both have ranked their own suspects.
async function screen(change: Change, client: ClientOutcome, source: SpecSource, cwd: string): Promise<Screened> {
  const windows = windowsOf(change, cwd);
  if (!client.ok) return { client, source, windows, standards: EMPTY_STANDARDS, spec: EMPTY_SPEC };
  const standards = await screenStandards(windows, RULES, client.client, {
    model: MODEL,
    defaultThreshold: DEFAULT_STANDARDS_THRESHOLD,
    thresholdOverrides: STANDARDS_THRESHOLD_OVERRIDES,
    maxSuspects: MAX_SUSPECTS,
    concurrency: CONCURRENT_REQUESTS,
  });
  const spec = source.status === 'ok' ?
    await screenSpec(specGridFiles(windows, SPEC_GRID_EXCLUDE), source.requirements, client.client, {
      model: MODEL,
      threshold: SPEC_THRESHOLD,
      maxSuspects: MAX_SUSPECTS,
      concurrency: CONCURRENT_REQUESTS,
    }) :
    EMPTY_SPEC;
  const capped = shareCap(standards, spec, MAX_SUSPECTS);
  return { client, source, windows, standards: { ...standards, ...capped.standards }, spec: { ...spec, ...capped.spec } };
}

function printSpec(record: SpecRecord): unknown {
  switch (record.status) {
    case 'ok':
      return { status: record.status, requirements: record.requirements.length, cells: record.cells.length, suspects: record.suspects, cut: record.cut };
    case 'failed':
      return { status: record.status, reason: record.reason, requirements: record.requirements.length, cells: record.cells.length };
    default:
      return record;
  }
}

function readFindings(source: string): string {
  return fs.readFileSync(source === STDIN ? process.stdin.fd : source, 'utf8');
}

function printFate(entry: SuspectFateRecord): Record<string, string> {
  const suspect = formatSuspectRef(entry.suspect);
  return entry.fate === 'dropped' ?
    { suspect, fate: entry.fate, reason: entry.reason } :
    { suspect, fate: entry.fate, finding: entry.finding };
}

export function recordOrigins(sidecar: string, readInput: () => string): unknown {
  const input = parseOriginsInput(readInput());
  const record = readSidecar(sidecar);
  const origins = assignOrigins(record, input, new Date().toISOString());
  writeSidecar(sidecar, { ...record, origins });
  return {
    sidecar,
    status: record.status,
    findings: origins.findings.map(({ id, origin }) => ({ id, origin })),
    suspects: origins.suspects.map(printFate),
  };
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const cwd = process.cwd();
  if (options.origins !== undefined && options.findings !== undefined) {
    const findings = options.findings;
    console.log(JSON.stringify(recordOrigins(path.resolve(cwd, options.origins), () => readFindings(findings)), null, 2));
    return;
  }
  const change = resolveChange(options, cwd);
  const screened = await screen(change, createClient(), readSpec(change.spec, cwd), cwd);

  const record = buildRecord(change, screened, options.calibration);
  const sidecar = path.join(resolveMainCheckout(cwd), SIDECAR_DIR, sidecarFileName({
    date: new Date(record.createdAt),
    branch: change.branch,
    scope: change.scope,
    ticket: change.ticket,
  }));
  writeSidecar(sidecar, record);

  console.log(JSON.stringify({
    status: record.status,
    reason: record.reason,
    model: record.model,
    sidecar,
    standards: { cells: record.standards.cells.length, suspects: record.standards.suspects, cut: record.standards.cut },
    spec: printSpec(record.spec),
  }, null, 2));
}

// run.sh always executes the compiled `tools/review-screen/dist/review-screen/index.js`, so that path
// is what marks this module as the process entry point; under vitest the entry is vitest's own binary.
const CLI_ENTRY_PATH = 'review-screen/dist/review-screen/index.js';

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
