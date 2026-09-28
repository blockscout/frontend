// The review's final findings table plus the `jev` axis's drop list, from one input: a JSON array or the
// Markdown tables the review publishes. Whatever the form, the output is the same two lists, so the
// matching in `./match.ts` never sees the format.

export const JEV_SOURCE = 'jev';

export type FindingLocation =
  { readonly kind: 'line'; readonly file: string; readonly line: number } |
  { readonly kind: 'requirement'; readonly requirement: string } |
  { readonly kind: 'none' };

export interface FindingRow {
  readonly id: string;
  readonly axis: string;
  readonly location: FindingLocation;
  readonly sources: ReadonlyArray<string>;
}

export type SuspectRef =
  { readonly kind: 'standards'; readonly rule: string; readonly file: string; readonly line: number } |
  { readonly kind: 'spec'; readonly requirement: string };

export interface DropEntry {
  readonly suspect: SuspectRef;
  readonly reason: string;
}

export interface OriginsInput {
  readonly findings: ReadonlyArray<FindingRow>;
  readonly drops: ReadonlyArray<DropEntry>;
}

const NO_LOCATION = '—';
const REQUIREMENT_ID = /^FR\d+$/;
const FILE_AND_LINE = /^(.+):(\d+)$/;
const FINDING_COLUMNS = [ 'id', 'axis', 'location', 'sources' ] as const;
const DROP_COLUMNS = [ 'suspect', 'fate', 'reason' ] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function unquote(cell: string): string {
  return cell.trim().replace(/^`(.*)`$/, '$1').trim();
}

export function parseLocation(raw: string): FindingLocation {
  const text = unquote(raw);
  if (text === '' || text === NO_LOCATION) return { kind: 'none' };
  if (REQUIREMENT_ID.test(text)) return { kind: 'requirement', requirement: text };
  const match = FILE_AND_LINE.exec(text);
  if (match === null) throw new Error(`Cannot read finding location: ${ raw }`);
  return { kind: 'line', file: match[1], line: Number(match[2]) };
}

// A standards suspect is named `<rule> <file>:<line>`, a spec suspect by its requirement id.
export function parseSuspectRef(raw: string): SuspectRef {
  const text = unquote(raw);
  if (REQUIREMENT_ID.test(text)) return { kind: 'spec', requirement: text };
  const space = text.lastIndexOf(' ');
  const match = space === -1 ? null : FILE_AND_LINE.exec(text.slice(space + 1));
  if (match === null) throw new Error(`Cannot read suspect reference (expected "<rule> <file>:<line>" or "FR<n>"): ${ raw }`);
  return { kind: 'standards', rule: text.slice(0, space).trim(), file: match[1], line: Number(match[2]) };
}

export function formatSuspectRef(ref: SuspectRef): string {
  return ref.kind === 'spec' ? ref.requirement : `${ ref.rule } ${ ref.file }:${ ref.line }`;
}

function parseSources(raw: unknown): Array<string> {
  if (Array.isArray(raw)) return raw.map((source) => String(source).trim()).filter((source) => source !== '');
  if (typeof raw === 'string') return unquote(raw).split(/[,\s]+/).map((source) => source.trim()).filter((source) => source !== '' && source !== NO_LOCATION);
  return [];
}

function readString(row: Record<string, unknown>, key: string): string {
  const value = row[key];
  if (typeof value !== 'string' && typeof value !== 'number') throw new Error(`Missing "${ key }" in ${ JSON.stringify(row) }`);
  return String(value);
}

function findingOf(row: Record<string, unknown>): FindingRow {
  return {
    id: readString(row, 'id').trim(),
    axis: unquote(readString(row, 'axis')),
    location: parseLocation(readString(row, 'location')),
    sources: parseSources(row.sources),
  };
}

// A confirmed suspect reaches the tool as a finding, so only `dropped` rows carry information here.
function dropOf(row: Record<string, unknown>): DropEntry | undefined {
  if (unquote(readString(row, 'fate')) !== 'dropped') return undefined;
  return {
    suspect: parseSuspectRef(readString(row, 'suspect')),
    reason: typeof row.reason === 'string' ? unquote(row.reason) : '',
  };
}

function collect(rows: ReadonlyArray<Record<string, unknown>>): OriginsInput {
  const findings: Array<FindingRow> = [];
  const drops: Array<DropEntry> = [];
  for (const row of rows) {
    if ('fate' in row) {
      const drop = dropOf(row);
      if (drop !== undefined) drops.push(drop);
    } else {
      findings.push(findingOf(row));
    }
  }
  return { findings, drops };
}

function fromJson(entries: ReadonlyArray<unknown>): OriginsInput {
  const rows = entries.map((entry) => {
    if (!isRecord(entry)) throw new Error(`Expected an object, got ${ JSON.stringify(entry) }`);
    return entry;
  });
  return collect(rows);
}

function splitRow(line: string): Array<string> {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());
}

function isSeparatorRow(cells: ReadonlyArray<string>): boolean {
  return cells.every((cell) => /^:?-+:?$/.test(cell));
}

interface MarkdownTable {
  readonly header: ReadonlyArray<string>;
  readonly rows: Array<Record<string, string>>;
}

function hasColumns(table: MarkdownTable, columns: ReadonlyArray<string>): boolean {
  return columns.every((column) => table.header.includes(column));
}

// Every pipe table in the text, its rows keyed by the lower-cased header cells.
function markdownTables(text: string): Array<MarkdownTable> {
  const tables: Array<MarkdownTable> = [];
  let header: Array<string> | undefined;
  let table: MarkdownTable | undefined;
  for (const line of text.split('\n')) {
    if (!line.trim().startsWith('|')) {
      header = undefined;
      table = undefined;
      continue;
    }
    const cells = splitRow(line);
    if (header === undefined) {
      header = cells.map((cell) => cell.toLowerCase());
      continue;
    }
    if (table === undefined) {
      if (isSeparatorRow(cells)) {
        table = { header, rows: [] };
        tables.push(table);
      } else {
        header = undefined;
      }
      continue;
    }
    table.rows.push(Object.fromEntries(header.map((column, index) => [ column, cells[index] ?? '' ])));
  }
  return tables;
}

function fromMarkdown(text: string): OriginsInput {
  const tables = markdownTables(text);
  const findingTables = tables.filter((table) => hasColumns(table, FINDING_COLUMNS));
  const dropTables = tables.filter((table) => hasColumns(table, DROP_COLUMNS));
  if (findingTables.length === 0) throw new Error('No findings table (| id | axis | location | sources |) in the input');
  return collect([ ...findingTables, ...dropTables ].flatMap((table) => table.rows));
}

export function parseOriginsInput(text: string): OriginsInput {
  const trimmed = text.trim();
  if (trimmed.startsWith('[')) {
    const parsed: unknown = JSON.parse(trimmed);
    if (!Array.isArray(parsed)) throw new Error('A JSON findings input must be an array');
    return fromJson(parsed);
  }
  return fromMarkdown(trimmed);
}
