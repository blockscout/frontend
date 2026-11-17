// Renders the per-file score table: how many mutants each file got, how many any test noticed, and
// the resulting mutation score, worst file first.

import type { FileScore } from '../stryker/report';

const NA = '—';

function scoreText(score: number | null): string {
  return score === null ? NA : `${ Math.round(score) }%`;
}

// Worst score first, so the weakest assertions lead. Files with nothing scored (null) fall to the
// bottom rather than reading as a perfect zero.
function byScoreAscending(a: FileScore, b: FileScore): number {
  return (a.score ?? Number.POSITIVE_INFINITY) - (b.score ?? Number.POSITIVE_INFINITY) || b.mutants - a.mutants;
}

interface Column {
  readonly header: string;
  readonly cell: (row: FileScore) => string;
  readonly alignRight: boolean;
}

const COLUMNS: ReadonlyArray<Column> = [
  { header: 'FILE', cell: (row) => row.file, alignRight: false },
  { header: 'SCORE', cell: (row) => scoreText(row.score), alignRight: true },
  { header: 'MUTANTS', cell: (row) => String(row.mutants), alignRight: true },
  { header: 'KILLED', cell: (row) => String(row.killed), alignRight: true },
  { header: 'SURVIVED', cell: (row) => String(row.survived), alignRight: true },
  { header: 'NO-COV', cell: (row) => String(row.noCoverage), alignRight: true },
];

function sum(rows: ReadonlyArray<FileScore>, of: (row: FileScore) => number): number {
  return rows.reduce((total, row) => total + of(row), 0);
}

// The overall score is recomputed from the totals rather than averaged over the per-file scores: a
// one-mutant file would otherwise weigh as much as a fifty-mutant one.
function summaryLine(rows: ReadonlyArray<FileScore>): string {
  const mutants = sum(rows, (row) => row.mutants);
  const killed = sum(rows, (row) => row.killed);
  const survived = sum(rows, (row) => row.survived);
  const noCoverage = sum(rows, (row) => row.noCoverage);
  const score = scoreText(mutants === 0 ? null : (killed / mutants) * 100);

  return `${ rows.length } file(s), ${ mutants } mutant(s): ${ killed } killed, ${ survived } survived, ${ noCoverage } without coverage — score ${ score }.`;
}

export function formatTable(rows: ReadonlyArray<FileScore>): string {
  const sorted = [ ...rows ].sort(byScoreAscending);
  const widths = COLUMNS.map((column) => Math.max(column.header.length, ...sorted.map((row) => column.cell(row).length)));
  const renderRow = (cells: ReadonlyArray<string>): string =>
    cells.map((cell, index) => COLUMNS[index].alignRight ? cell.padStart(widths[index]) : cell.padEnd(widths[index])).join('  ');

  const lines = [ renderRow(COLUMNS.map((column) => column.header)) ];
  for (const row of sorted) lines.push(renderRow(COLUMNS.map((column) => column.cell(row))));
  lines.push('');
  lines.push(summaryLine(sorted));

  return lines.join('\n');
}
