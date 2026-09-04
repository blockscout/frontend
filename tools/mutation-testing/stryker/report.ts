import fs from 'fs';

import { JSON_REPORT_FILE } from '../config';

// Reads Stryker's JSON report — the mutation-testing-elements schema its json reporter writes — and
// reduces it to one row per file. The clear-text reporter is not used: it prints every mutant with
// its full diff, which is unusable at this scale.

// Stryker's per-mutant verdicts. Only the four that bear on assertion strength are scored; see
// SCORED_STATUSES.
export type MutantStatus =
  'Killed' | 'Survived' | 'NoCoverage' | 'Timeout' |
  'CompileError' | 'RuntimeError' | 'Ignored' | 'Pending';

export interface MutantPosition {
  readonly line: number;
  readonly column: number;
}

export interface Mutant {
  readonly id: string;
  readonly mutatorName: string;
  readonly status: MutantStatus;
  readonly location: { readonly start: MutantPosition; readonly end: MutantPosition };
}

export interface MutationReport {
  readonly files: Readonly<Record<string, { readonly mutants: ReadonlyArray<Mutant> }>>;
}

export interface FileScore {
  readonly file: string;
  readonly mutants: number; // the scored ones only, i.e. killed + survived + noCoverage
  readonly killed: number;
  readonly survived: number;
  readonly noCoverage: number;
  readonly score: number | null; // percentage; null when the file has no scored mutants at all
}

// A timeout means the mutant broke the code badly enough to hang a test, which is a detection —
// Stryker's own score counts it as killed, and so does the KILLED column.
const KILLED_STATUSES: ReadonlyArray<MutantStatus> = [ 'Killed', 'Timeout' ];

// Everything else is excluded from the denominator: Ignored is the whole non-logic mutator set the
// config turns off, and the error statuses say the mutant never ran rather than that nothing caught it.
const SCORED_STATUSES: ReadonlyArray<MutantStatus> = [ ...KILLED_STATUSES, 'Survived', 'NoCoverage' ];

export function parseReport(json: string): MutationReport {
  return JSON.parse(json) as MutationReport;
}

export function readReport(): MutationReport {
  if (!fs.existsSync(JSON_REPORT_FILE)) {
    throw new Error(`Stryker wrote no report to ${ JSON_REPORT_FILE } — see its output above for why the run did not finish.`);
  }
  return parseReport(fs.readFileSync(JSON_REPORT_FILE, 'utf8'));
}

function countBy(mutants: ReadonlyArray<Mutant>, statuses: ReadonlyArray<MutantStatus>): number {
  return mutants.filter((mutant) => statuses.includes(mutant.status)).length;
}

function scoreFile(file: string, mutants: ReadonlyArray<Mutant>): FileScore {
  const killed = countBy(mutants, KILLED_STATUSES);
  const scored = countBy(mutants, SCORED_STATUSES);

  return {
    file,
    mutants: scored,
    killed,
    survived: countBy(mutants, [ 'Survived' ]),
    noCoverage: countBy(mutants, [ 'NoCoverage' ]),
    score: scored === 0 ? null : (killed / scored) * 100,
  };
}

export function buildFileScores(report: MutationReport): Array<FileScore> {
  return Object.entries(report.files).map(([ file, { mutants } ]) => scoreFile(file, mutants));
}

// The two findings a run produces, kept apart because they are different problems. A survivor is a
// weak assertion: a test ran the line and noticed nothing. A no-coverage mutant is an untested line,
// which is the CRAP gate's question, not this one's — so it is counted, not listed.

// Survivors are grouped by the line they sit on: several mutators surviving together is one weak
// assertion, not several findings.
export interface LineFinding {
  readonly line: number;
  // Mutator names, each carrying how many mutants of that kind survived on the line.
  readonly mutators: ReadonlyArray<{ readonly name: string; readonly count: number }>;
}

export interface FileSurvivors {
  readonly file: string;
  readonly lines: ReadonlyArray<LineFinding>;
}

export interface FileNoCoverage {
  readonly file: string;
  readonly mutants: number;
}

export interface Findings {
  readonly survivors: ReadonlyArray<FileSurvivors>;
  readonly noCoverage: ReadonlyArray<FileNoCoverage>;
}

// Code-point order, not the shared collator: this tool sits outside the src/ tsconfig that owns it,
// and a locale-independent order is what keeps two runs over an unchanged tree byte-identical.
function compare(a: string, b: string): number {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

function tally(names: ReadonlyArray<string>): Array<{ name: string; count: number }> {
  const counts = new Map<string, number>();
  for (const name of names) counts.set(name, (counts.get(name) ?? 0) + 1);

  return [ ...counts ].map(([ name, count ]) => ({ name, count })).sort((a, b) => compare(a.name, b.name));
}

function groupByLine(mutants: ReadonlyArray<Mutant>): Array<LineFinding> {
  const byLine = new Map<number, Array<string>>();
  for (const mutant of mutants) {
    const line = mutant.location.start.line;
    byLine.set(line, [ ...byLine.get(line) ?? [], mutant.mutatorName ]);
  }

  return [ ...byLine ]
    .sort(([ a ], [ b ]) => a - b)
    .map(([ line, names ]) => ({ line, mutators: tally(names) }));
}

function withStatus(mutants: ReadonlyArray<Mutant>, status: MutantStatus): Array<Mutant> {
  return mutants.filter((mutant) => mutant.status === status);
}

// Alphabetical by file, ascending by line: two runs over an unchanged tree must read identically,
// and the report's own file order is whatever Stryker happened to emit.
function byFile<TEntry extends { readonly file: string }>(a: TEntry, b: TEntry): number {
  return compare(a.file, b.file);
}

// What makes a run a failure, and the only thing that does: a mutant nothing caught. A no-coverage
// mutant is an untested line, which the CRAP gate already fails a PR for — failing here too would
// report one gap twice and make this gate's verdict unreadable.
export function isFailingRun(findings: Findings): boolean {
  return findings.survivors.length > 0;
}

export function collectFindings(report: MutationReport): Findings {
  const files = Object.entries(report.files);

  return {
    survivors: files
      .map(([ file, { mutants } ]) => ({ file, lines: groupByLine(withStatus(mutants, 'Survived')) }))
      .filter((entry) => entry.lines.length > 0)
      .sort(byFile),
    noCoverage: files
      .map(([ file, { mutants } ]) => ({ file, mutants: withStatus(mutants, 'NoCoverage').length }))
      .filter((entry) => entry.mutants > 0)
      .sort(byFile),
  };
}
