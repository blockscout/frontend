// Renders the results table (spec FR8). Ticket 01 reports complexity only, sorted by
// complexity descending; ticket 02 adds coverage% and CRAP columns and re-sorts by CRAP.

export interface ReportRow {
  file: string;
  line: number;
  name: string;
  complexity: number;
  isOffender: boolean;
}

const OFFENDER_MARK = '✗';
const OK_MARK = '';

function pad(value: string, width: number): string {
  return value.length >= width ? value : value + ' '.repeat(width - value.length);
}

function padStart(value: string, width: number): string {
  return value.length >= width ? value : ' '.repeat(width - value.length) + value;
}

export function formatTable(rows: ReadonlyArray<ReportRow>, maxComplexity: number): string {
  const sorted = [ ...rows ].sort((a, b) => b.complexity - a.complexity);

  const location = (row: ReportRow): string => `${ row.file }:${ row.line }`;

  const headers = { flag: '', loc: 'FUNCTION', name: 'NAME', cx: 'CX' };
  const locWidth = Math.max(headers.loc.length, ...sorted.map((row) => location(row).length));
  const nameWidth = Math.max(headers.name.length, ...sorted.map((row) => row.name.length));
  const cxWidth = Math.max(headers.cx.length, ...sorted.map((row) => String(row.complexity).length));

  const line = (flag: string, loc: string, name: string, cx: string): string =>
    `${ pad(flag, 1) }  ${ pad(loc, locWidth) }  ${ pad(name, nameWidth) }  ${ padStart(cx, cxWidth) }`;

  const lines: Array<string> = [];
  lines.push(line(headers.flag, headers.loc, headers.name, headers.cx));
  for (const row of sorted) {
    lines.push(line(
      row.isOffender ? OFFENDER_MARK : OK_MARK,
      location(row),
      row.name,
      String(row.complexity),
    ));
  }

  const offenderCount = sorted.filter((row) => row.isOffender).length;
  lines.push('');
  lines.push(offenderCount > 0 ?
    `${ offenderCount } function(s) exceed the complexity cap of ${ maxComplexity }.` :
    `All ${ sorted.length } checked function(s) are within the complexity cap of ${ maxComplexity }.`);

  return lines.join('\n');
}
