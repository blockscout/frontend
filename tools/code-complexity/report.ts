// Renders the results table (spec FR8): every checked function with its cognitive complexity,
// coverage%, CRAP, and which threshold (if any) it broke, sorted by CRAP descending with offenders
// flagged. Cyclomatic complexity (CX) is not a default column — with cognitive complexity governing
// decomposition, the only fix for a CRAP failure is coverage, never lowering CX, so CX is never
// actionable in the default view. It stays available under --verbose for calibration and debugging.

import type { Contribution } from './complexity';

// A function's class, decided by whether JSX appears directly in its own body (see ./complexity.ts).
// It selects the cognitive cap and whether the CRAP half applies.
export type FunctionKind = 'jsx' | 'behavior';

export interface ReportRow {
  readonly file: string;
  readonly line: number;
  readonly name: string;
  readonly kind: FunctionKind;
  // Cyclomatic complexity — the CRAP input, shown only under --verbose.
  readonly complexity: number;
  // Cognitive complexity — the readability gate.
  readonly cognitive: number;
  // Cognitive-complexity increment sites, for the actionable violation annotation.
  readonly contributions: ReadonlyArray<Contribution>;
  // 0..1 line-coverage fraction; null when the coverage half does not apply (a `jsx` function, or no
  // coverage report supplied).
  readonly coverage: number | null;
  readonly crap: number | null; // null whenever coverage is null
  readonly brokeCognitive: boolean;
  readonly brokeCrap: boolean;
}

export interface Thresholds {
  readonly maxCognitiveJsx: number;
  readonly maxCognitiveBehavior: number;
  readonly maxCrap: number;
}

// The cognitive-complexity cap that applies to a function, chosen by its class.
export function maxCognitiveFor(kind: FunctionKind, thresholds: Thresholds): number {
  return kind === 'jsx' ? thresholds.maxCognitiveJsx : thresholds.maxCognitiveBehavior;
}

const OFFENDER_MARK = '✗';
const OK_MARK = '';
const NA = '—';

export function isOffender(row: ReportRow): boolean {
  return row.brokeCognitive || row.brokeCrap;
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
  if (row.brokeCognitive && row.brokeCrap) return 'COG+CRAP';
  if (row.brokeCognitive) return 'COG';
  if (row.brokeCrap) return 'CRAP';
  return '';
}

// Sort by CRAP descending so the worst offenders lead; JSX/no-coverage rows (null CRAP) fall to the
// bottom, tie-broken by cognitive complexity so they stay usefully ordered.
function byCrapDescending(a: ReportRow, b: ReportRow): number {
  return (b.crap ?? -1) - (a.crap ?? -1) || b.cognitive - a.cognitive;
}

// A column: header, a cell renderer, and whether cells right-align (numbers) or left-align (text).
interface Column {
  readonly header: string;
  readonly cell: (row: ReportRow) => string;
  readonly alignRight: boolean;
}

// `verbose` adds the CX (cyclomatic) column, off by default because it is never the fix for a failure.
function columnsFor(verbose: boolean): Array<Column> {
  const columns: Array<Column> = [
    { header: 'FUNCTION', cell: (row) => `${ row.file }:${ row.line }`, alignRight: false },
    { header: 'NAME', cell: (row) => row.name, alignRight: false },
    { header: 'KIND', cell: (row) => row.kind, alignRight: false },
    { header: 'COG', cell: (row) => String(row.cognitive), alignRight: true },
    { header: 'COV', cell: coverageText, alignRight: true },
    { header: 'CRAP', cell: crapText, alignRight: true },
    { header: 'BROKE', cell: brokeText, alignRight: false },
  ];
  if (verbose) columns.splice(3, 0, { header: 'CX', cell: (row) => String(row.complexity), alignRight: true });
  return columns;
}

export function formatTable(rows: ReadonlyArray<ReportRow>, thresholds: Thresholds, verbose = false): string {
  const sorted = [ ...rows ].sort(byCrapDescending);
  const columns = columnsFor(verbose);

  // The flag column is a fixed 1-char gutter; the rest size to their widest cell.
  const widths = columns.map((column) => Math.max(column.header.length, ...sorted.map((row) => column.cell(row).length)));
  const renderRow = (flag: string, cells: ReadonlyArray<string>): string =>
    [ pad(flag, 1), ...cells.map((cell, index) => columns[index].alignRight ? padStart(cell, widths[index]) : pad(cell, widths[index])) ].join('  ');

  const lines: Array<string> = [];
  lines.push(renderRow('', columns.map((column) => column.header)));
  for (const row of sorted) {
    lines.push(renderRow(isOffender(row) ? OFFENDER_MARK : OK_MARK, columns.map((column) => column.cell(row))));
  }

  const caps = `cognitive jsx ${ thresholds.maxCognitiveJsx } / behavior ${ thresholds.maxCognitiveBehavior }, CRAP ${ thresholds.maxCrap }`;
  const offenderCount = sorted.filter(isOffender).length;
  lines.push('');
  lines.push(offenderCount > 0 ?
    `${ offenderCount } function(s) broke a threshold (${ caps }).` :
    `All ${ sorted.length } checked function(s) are within thresholds (${ caps }).`);

  return lines.join('\n');
}
