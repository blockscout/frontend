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
