import type { PilotReport, RuleRow } from './aggregate';
import type { NearMissRow, SweepRow } from './tuning';

const MAX_REASON_CHARS = 60;
const NONE = '—';

const RULE_HEADERS = [ 'rule', 'sent', 'confirmed', 'merged', 'dropped', 'top drop reason' ] as const;
const NEAR_MISS_HEADERS = [ 'rule', 'labelled', 'no cell', 'file score min / median / max' ] as const;
const SWEEP_RULE_HEADER = 'rule';
const SWEEP_THRESHOLD_HEADER = 'threshold';
const SCORE_DECIMALS = 2;

function clip(text: string): string {
  return text.length <= MAX_REASON_CHARS ? text : `${ text.slice(0, MAX_REASON_CHARS - 1) }…`;
}

function ruleCells(row: RuleRow): Array<string> {
  const reason = row.topDropReason === undefined ? NONE : clip(row.topDropReason);
  return [ row.rule, String(row.sent), String(row.confirmed), String(row.merged), String(row.dropped), reason ];
}

function score(value: number): string {
  return value.toFixed(SCORE_DECIMALS);
}

function nearMissCells(row: NearMissRow): Array<string> {
  const spread = row.scores === undefined ? NONE : `${ score(row.scores.min) } / ${ score(row.scores.median) } / ${ score(row.scores.max) }`;
  return [ row.rule, String(row.labelled), String(row.noCell), spread ];
}

function sweepHeaders(rows: ReadonlyArray<SweepRow>): Array<string> {
  const thresholds = rows[0]?.at.map((count) => `${ count.threshold } hit/noise/missed`) ?? [];
  return [ SWEEP_RULE_HEADER, SWEEP_THRESHOLD_HEADER, ...thresholds ];
}

function sweepCells(row: SweepRow): Array<string> {
  return [ row.rule, String(row.threshold), ...row.at.map((count) => `${ count.hit }/${ count.noise }/${ count.missed }`) ];
}

function coverageLine(report: PilotReport): string {
  const { coverage } = report;
  return [
    `coverage: ${ coverage.standardsFindings } standards findings`,
    `${ coverage.noCell } in a file with no cell`,
    `${ coverage.outsideWindows } on a line outside every window`,
    `${ coverage.unlocated } with no location recorded`,
  ].join(' · ');
}

export function renderTable(headers: ReadonlyArray<string>, rows: ReadonlyArray<ReadonlyArray<string>>): string {
  const widths = headers.map((header, column) => Math.max(header.length, ...rows.map((row) => row[column].length)));
  const line = (cells: ReadonlyArray<string>): string => cells.map((cell, column) => cell.padEnd(widths[column])).join('  ').trimEnd();
  return [ line(headers), line(widths.map((width) => '-'.repeat(width))), ...rows.map(line) ].join('\n');
}

function totalsLines(report: PilotReport): Array<string> {
  const { totals } = report;
  return [
    `reviews: ${ totals.reviews } counted · ${ totals.pending } pending origins`,
    `findings: jev ${ totals.findings.jev } / axis ${ totals.findings.axis } / both ${ totals.findings.both }`,
    `added seconds per review: mean ${ totals.addedSeconds.mean.toFixed(1) } · max ${ totals.addedSeconds.max.toFixed(1) }`,
    `input tokens per review: mean ${ Math.round(totals.meanInputTokens) }`,
  ];
}

export function renderReport(report: PilotReport): string {
  const sections = [
    renderTable(RULE_HEADERS, report.rules.map(ruleCells)),
    renderTable(NEAR_MISS_HEADERS, report.nearMisses.map(nearMissCells)),
    renderTable(sweepHeaders(report.sweep), report.sweep.map(sweepCells)),
    [ ...totalsLines(report), coverageLine(report) ].join('\n'),
  ];
  if (report.pending.length > 0) sections.push([ 'pending origins:', ...report.pending.map((file) => `  ${ file }`) ].join('\n'));
  return sections.join('\n\n');
}

export function renderReportJson(report: PilotReport): string {
  return JSON.stringify(report, null, 2);
}
