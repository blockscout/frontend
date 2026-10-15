import { median } from 'es-toolkit';

import type { FindingOriginRecord } from '../origins/match';
import type { FindingLocation } from '../origins/parse';
import type { SidecarRecord } from '../sidecar';

export interface ScoreSpread {
  readonly min: number;
  readonly median: number;
  readonly max: number;
}

export interface NearMissRow {
  readonly rule: string;
  readonly labelled: number;
  readonly noCell: number;
  readonly scores: ScoreSpread | undefined;
}

export interface SweepCount {
  readonly threshold: number;
  readonly hit: number;
  readonly noise: number;
  readonly missed: number;
}

export interface SweepRow {
  readonly rule: string;
  readonly threshold: number;
  readonly at: ReadonlyArray<SweepCount>;
}

export interface CoverageTotals {
  readonly standardsFindings: number;
  readonly noCell: number;
  readonly outsideWindows: number;
  // Findings recorded before `--origins` kept the location; they count in none of the above.
  readonly unlocated: number;
}

interface LineFinding {
  readonly record: SidecarRecord;
  readonly finding: FindingOriginRecord;
  readonly file: string;
  readonly line: number;
}

// Rule → file → the highest window score, the cell the threshold is applied to.
type BestCells = ReadonlyMap<string, ReadonlyMap<string, number>>;

export function bestCellsOf(record: SidecarRecord): BestCells {
  const best = new Map<string, Map<string, number>>();
  for (const cell of record.standards.cells) {
    const files = best.get(cell.rule) ?? new Map<string, number>();
    files.set(cell.file, Math.max(files.get(cell.file) ?? 0, cell.score));
    best.set(cell.rule, files);
  }
  return best;
}

function lineFindings(records: ReadonlyArray<SidecarRecord>, keep: (finding: FindingOriginRecord) => boolean): Array<LineFinding> {
  return records.flatMap((record) => record.origins === undefined ? [] : record.origins.findings.flatMap((finding) => {
    const location: FindingLocation | undefined = finding.location;
    if (!keep(finding) || location === undefined || location.kind !== 'line') return [];
    return [ { record, finding, file: location.file, line: location.line } ];
  }));
}

function spreadOf(scores: ReadonlyArray<number>): ScoreSpread | undefined {
  if (scores.length === 0) return undefined;
  return { min: Math.min(...scores), median: median([ ...scores ]), max: Math.max(...scores) };
}

interface LabelledCells {
  readonly scores: Array<number>;
  readonly noCell: number;
}

function labelledCells(rule: string, findings: ReadonlyArray<LineFinding>, bestByRecord: ReadonlyMap<SidecarRecord, BestCells>): LabelledCells {
  const scores: Array<number> = [];
  let noCell = 0;
  for (const entry of findings) {
    const score = bestByRecord.get(entry.record)?.get(rule)?.get(entry.file);
    if (score === undefined) noCell += 1;
    else scores.push(score);
  }
  return { scores, noCell };
}

export function nearMissRows(records: ReadonlyArray<SidecarRecord>, ruleIds: ReadonlyArray<string>): Array<NearMissRow> {
  const bestByRecord = new Map(records.map((record) => [ record, bestCellsOf(record) ] as const));
  return ruleIds.map((rule) => {
    const labelled = lineFindings(records, (finding) => finding.rule === rule);
    const { scores, noCell } = labelledCells(rule, labelled, bestByRecord);
    return { rule, labelled: labelled.length, noCell, scores: spreadOf(scores) };
  });
}

interface SweepCell {
  readonly score: number;
  readonly labelled: boolean;
}

function sweepCellsOf(rule: string, record: SidecarRecord): Array<SweepCell> {
  const labelledFiles = new Set(lineFindings([ record ], (finding) => finding.rule === rule).map((entry) => entry.file));
  const files = bestCellsOf(record).get(rule) ?? new Map<string, number>();
  return [ ...files ].map(([ file, score ]) => ({ score, labelled: labelledFiles.has(file) }));
}

function countAt(threshold: number, cells: ReadonlyArray<SweepCell>): SweepCount {
  const over = cells.filter((cell) => cell.score >= threshold);
  return {
    threshold,
    hit: over.filter((cell) => cell.labelled).length,
    noise: over.filter((cell) => !cell.labelled).length,
    missed: cells.filter((cell) => cell.score < threshold && cell.labelled).length,
  };
}

export function sweepRows(
  records: ReadonlyArray<SidecarRecord>,
  ruleIds: ReadonlyArray<string>,
  thresholds: ReadonlyArray<number>,
  thresholdOf: (rule: string) => number,
): Array<SweepRow> {
  return ruleIds.map((rule) => {
    const cells = records.flatMap((record) => sweepCellsOf(rule, record));
    return { rule, threshold: thresholdOf(rule), at: thresholds.map((threshold) => countAt(threshold, cells)) };
  });
}

const STANDARDS_AXIS = 'standards';

function isOutsideWindows(entry: LineFinding): boolean {
  return !entry.record.windows.some((span) => span.file === entry.file && span.firstLine <= entry.line && entry.line <= span.lastLine);
}

export function coverageTotals(records: ReadonlyArray<SidecarRecord>): CoverageTotals {
  const standards = records.flatMap((record) => record.origins?.findings.filter((finding) => finding.axis === STANDARDS_AXIS) ?? []);
  const located = lineFindings(records, (finding) => finding.axis === STANDARDS_AXIS);
  const scoredFiles = new Map(records.map((record) => [ record, new Set(record.standards.cells.map((cell) => cell.file)) ] as const));
  const noCell = located.filter((entry) => !scoredFiles.get(entry.record)?.has(entry.file));
  const outsideWindows = located.filter((entry) => scoredFiles.get(entry.record)?.has(entry.file) && isOutsideWindows(entry));
  return {
    standardsFindings: standards.length,
    noCell: noCell.length,
    outsideWindows: outsideWindows.length,
    unlocated: standards.filter((finding) => finding.location === undefined).length,
  };
}
