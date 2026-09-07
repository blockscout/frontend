import fs from 'fs';

import { STREAM_REPORT_FILE } from '../config';
import type { Mutant, MutationReport } from './report';

// The line-delimited result stream the reporter plugin writes and a truncated run reads back.
// Stryker's own json report lands only when a whole run finishes, so a run stopped at its
// wall-clock budget has nothing else to report from. One JSON object per line is what makes a file
// cut off mid-write usable: every complete line before the cut is still a whole record.

export type StreamRecord =
  // Emitted once, when Stryker has planned the run: the denominator for how much of the selection a
  // truncated run got through.
  { readonly kind: 'plan'; readonly mutants: number } |
  { readonly kind: 'mutant'; readonly file: string; readonly mutant: Mutant };

export interface StreamedRun {
  readonly report: MutationReport;
  readonly tested: number;
  // null when the run was stopped before Stryker finished planning, which leaves the total unknown
  // rather than zero.
  readonly planned: number | null;
}

export function formatStreamRecord(record: StreamRecord): string {
  return `${ JSON.stringify(record) }\n`;
}

// Every line that is not a whole record is dropped, blank ones included — the trailing newline of
// the last complete record leaves one, and the last line of a stopped run can be half-written. Any
// other line that does not parse is equally unusable, and dropping it beats failing the whole read.
function parseLine(line: string): StreamRecord | undefined {
  try {
    return JSON.parse(line) as StreamRecord;
  } catch {
    return undefined;
  }
}

function isRecord(record: StreamRecord | undefined): record is StreamRecord {
  return record !== undefined;
}

export function parseStream(contents: string): StreamedRun {
  const records = contents.split('\n').map(parseLine).filter(isRecord);

  const files: Record<string, { mutants: Array<Mutant> }> = {};
  let planned: number | null = null;
  let tested = 0;

  for (const record of records) {
    if (record.kind === 'plan') {
      planned = record.mutants;
      continue;
    }
    files[record.file] ??= { mutants: [] };
    files[record.file].mutants.push(record.mutant);
    tested += 1;
  }

  return { report: { files }, tested, planned };
}

// A run stopped before the plugin wrote anything leaves no file at all, which is a stream with
// nothing in it rather than an error: the report then says plainly that no mutant was tested.
export function readStream(): StreamedRun {
  const contents = fs.existsSync(STREAM_REPORT_FILE) ? fs.readFileSync(STREAM_REPORT_FILE, 'utf8') : '';
  return parseStream(contents);
}
