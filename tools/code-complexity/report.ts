// Renders the results table (spec FR8): every checked function with its complexity, coverage%,
// CRAP, and which threshold (if any) it broke, sorted by CRAP descending with offenders flagged.

export interface ReportRow {
  readonly file: string;
  readonly line: number;
  readonly name: string;
  readonly complexity: number;
  // 0..1 line-coverage fraction; null when the coverage half does not apply (a JSX file, or no
  // coverage report supplied).
  readonly coverage: number | null;
  readonly crap: number | null; // null whenever coverage is null
  readonly brokeComplexity: boolean;
  readonly brokeCrap: boolean;
}

export interface Thresholds {
  readonly maxComplexity: number;
  readonly maxCrap: number;
}

const OFFENDER_MARK = '✗';
const OK_MARK = '';
const NA = '—';

export function isOffender(row: ReportRow): boolean {
  return row.brokeComplexity || row.brokeCrap;
}

function pad(value: string, width: number): string {
  return value.length >= width ? value : value + ' '.repeat(width - value.length);
}

function padStart(value: string, width: number): string {
  return value.length >= width ? value : ' '.repeat(width - value.length) + value;
}

function coverageText(row: ReportRow): string {
  return row.coverage === null ? NA : `${ Math.round(row.coverage * 100) }%`;
}

function crapText(row: ReportRow): string {
  return row.crap === null ? NA : row.crap.toFixed(1);
}

function brokeText(row: ReportRow): string {
  if (row.brokeComplexity && row.brokeCrap) return 'CX+CRAP';
  if (row.brokeComplexity) return 'CX';
  if (row.brokeCrap) return 'CRAP';
  return '';
}

// Sort by CRAP descending so the worst offenders lead; JSX/no-coverage rows (null CRAP) fall to the
// bottom, tie-broken by complexity so they stay usefully ordered.
function byCrapDescending(a: ReportRow, b: ReportRow): number {
  return (b.crap ?? -1) - (a.crap ?? -1) || b.complexity - a.complexity;
}

export function formatTable(rows: ReadonlyArray<ReportRow>, thresholds: Thresholds): string {
  const sorted = [ ...rows ].sort(byCrapDescending);
  const location = (row: ReportRow): string => `${ row.file }:${ row.line }`;

  const headers = { flag: '', loc: 'FUNCTION', name: 'NAME', cx: 'CX', cov: 'COV', crap: 'CRAP', broke: 'BROKE' };
  const width = {
    loc: Math.max(headers.loc.length, ...sorted.map((row) => location(row).length)),
    name: Math.max(headers.name.length, ...sorted.map((row) => row.name.length)),
    cx: Math.max(headers.cx.length, ...sorted.map((row) => String(row.complexity).length)),
    cov: Math.max(headers.cov.length, ...sorted.map((row) => coverageText(row).length)),
    crap: Math.max(headers.crap.length, ...sorted.map((row) => crapText(row).length)),
    broke: Math.max(headers.broke.length, ...sorted.map((row) => brokeText(row).length)),
  };

  const line = (flag: string, loc: string, name: string, cx: string, cov: string, crap: string, broke: string): string =>
    [
      pad(flag, 1),
      pad(loc, width.loc),
      pad(name, width.name),
      padStart(cx, width.cx),
      padStart(cov, width.cov),
      padStart(crap, width.crap),
      pad(broke, width.broke),
    ].join('  ');

  const lines: Array<string> = [];
  lines.push(line(headers.flag, headers.loc, headers.name, headers.cx, headers.cov, headers.crap, headers.broke));
  for (const row of sorted) {
    lines.push(line(
      isOffender(row) ? OFFENDER_MARK : OK_MARK,
      location(row),
      row.name,
      String(row.complexity),
      coverageText(row),
      crapText(row),
      brokeText(row),
    ));
  }

  const offenderCount = sorted.filter(isOffender).length;
  lines.push('');
  lines.push(offenderCount > 0 ?
    `${ offenderCount } function(s) broke a threshold (complexity > ${ thresholds.maxComplexity } or CRAP > ${ thresholds.maxCrap }).` :
    `All ${ sorted.length } checked function(s) are within thresholds (complexity ${ thresholds.maxComplexity }, CRAP ${ thresholds.maxCrap }).`);

  return lines.join('\n');
}
