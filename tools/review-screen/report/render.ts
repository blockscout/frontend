import type { PilotReport, RuleRow } from './aggregate';

// The keep-or-kill table as text. The JSON form is the report object itself.

const MAX_REASON_CHARS = 60;
const NONE = '—';

const RULE_HEADERS = [ 'rule', 'sent', 'confirmed', 'merged', 'dropped', 'top drop reason' ] as const;

function clip(text: string): string {
  return text.length <= MAX_REASON_CHARS ? text : `${ text.slice(0, MAX_REASON_CHARS - 1) }…`;
}

function ruleCells(row: RuleRow): Array<string> {
  const reason = row.topDropReason === undefined ? NONE : clip(row.topDropReason);
  return [ row.rule, String(row.sent), String(row.confirmed), String(row.merged), String(row.dropped), reason ];
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
    totalsLines(report).join('\n'),
  ];
  if (report.pending.length > 0) sections.push([ 'pending origins:', ...report.pending.map((file) => `  ${ file }`) ].join('\n'));
  return sections.join('\n\n');
}

export function renderReportJson(report: PilotReport): string {
  return JSON.stringify(report, null, 2);
}
