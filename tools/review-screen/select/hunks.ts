import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// A file's change as the model sees it: the changed hunks with their surrounding context, every
// new-side line carrying a stable id (`L<line>`) the locate step can hand back. Windowing keeps a
// state under the model's limit — hunks stay whole where they can, and a hunk too big on its own is
// cut on lines.

export type LineKind = 'context' | 'added' | 'removed';

export interface StateLine {
  readonly kind: LineKind;
  // The new-side line number; a removed line has none.
  readonly line: number | undefined;
  readonly text: string;
}

export interface Hunk {
  readonly lines: ReadonlyArray<StateLine>;
}

export interface Window {
  readonly index: number;
  readonly state: string;
  readonly changedIds: ReadonlyArray<string>;
  readonly firstLine: number;
}

export interface WindowLimits {
  readonly maxChars: number;
  readonly maxChangedLines: number;
}

export interface FileWindows {
  readonly file: string;
  readonly windows: ReadonlyArray<Window>;
}

const HUNK_HEADER = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/;
const HUNK_SEPARATOR = '@@';

export function lineId(line: number): string {
  return `L${ line }`;
}

export function parseLineId(id: string): number | undefined {
  const match = /^L(\d+)$/.exec(id);
  return match ? Number(match[1]) : undefined;
}

function flush(lines: Array<StateLine>, hunks: Array<Hunk>): void {
  if (lines.length > 0) hunks.push({ lines: [ ...lines ] });
  lines.length = 0;
}

// The new-side line counter advances on context and added lines only; removed lines are kept for
// what they say about the change but carry no id.
export function parseUnifiedDiff(diffText: string): Array<Hunk> {
  const hunks: Array<Hunk> = [];
  const lines: Array<StateLine> = [];
  let line = 0;
  let inHunk = false;

  for (const raw of diffText.split('\n')) {
    const header = HUNK_HEADER.exec(raw);
    if (header) {
      flush(lines, hunks);
      line = Number(header[1]);
      inHunk = true;
      continue;
    }
    if (!inHunk || raw.startsWith('\\')) continue;
    const marker = raw[0];
    if (marker === '+') {
      lines.push({ kind: 'added', line, text: raw.slice(1) });
      line += 1;
    } else if (marker === '-') {
      lines.push({ kind: 'removed', line: undefined, text: raw.slice(1) });
    } else if (marker === ' ') {
      lines.push({ kind: 'context', line, text: raw.slice(1) });
      line += 1;
    } else {
      inHunk = false;
    }
  }
  flush(lines, hunks);
  return hunks;
}

export function wholeFileHunk(content: string): Hunk {
  const body = content.endsWith('\n') ? content.slice(0, -1) : content;
  return { lines: body.split('\n').map((text, index) => ({ kind: 'added', line: index + 1, text })) };
}

function isBinary(buffer: Buffer): boolean {
  return buffer.includes(0);
}

export function readHunks(file: string, untracked: boolean, base: string, contextLines: number, cwd: string): Array<Hunk> {
  if (untracked) {
    const buffer = fs.readFileSync(path.resolve(cwd, file));
    return isBinary(buffer) ? [] : [ wholeFileHunk(buffer.toString('utf8')) ];
  }
  const diff = execFileSync('git', [ 'diff', `--unified=${ contextLines }`, '--no-color', base, '--', file ], {
    cwd,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  return parseUnifiedDiff(diff);
}

export function renderLine(line: StateLine): string {
  switch (line.kind) {
    case 'added':
      return `${ lineId(line.line as number) } + ${ line.text }`;
    case 'context':
      return `${ lineId(line.line as number) }   ${ line.text }`;
    case 'removed':
      return `    - ${ line.text }`;
  }
}

function measure(lines: ReadonlyArray<StateLine>): { readonly chars: number; readonly changed: number } {
  let chars = 0;
  let changed = 0;
  for (const line of lines) {
    chars += renderLine(line).length + 1;
    if (line.kind === 'added') changed += 1;
  }
  return { chars, changed };
}

function fits(lines: ReadonlyArray<StateLine>, limits: WindowLimits): boolean {
  const { chars, changed } = measure(lines);
  return chars <= limits.maxChars && changed <= limits.maxChangedLines;
}

// Cut one oversized hunk on lines. A single line longer than the whole budget still becomes its own
// chunk — the model gets a long line rather than the tool dropping code silently.
function splitHunk(hunk: Hunk, limits: WindowLimits): Array<Hunk> {
  const chunks: Array<Hunk> = [];
  let current: Array<StateLine> = [];
  for (const line of hunk.lines) {
    if (current.length > 0 && !fits([ ...current, line ], limits)) {
      chunks.push({ lines: current });
      current = [];
    }
    current.push(line);
  }
  if (current.length > 0) chunks.push({ lines: current });
  return chunks;
}

function toWindow(hunks: ReadonlyArray<Hunk>, index: number): Window {
  const lines = hunks.flatMap((hunk) => hunk.lines);
  const numbered = lines.map((line) => line.line).filter((line): line is number => line !== undefined);
  return {
    index,
    state: hunks.map((hunk) => hunk.lines.map(renderLine).join('\n')).join(`\n${ HUNK_SEPARATOR }\n`),
    changedIds: lines.filter((line) => line.kind === 'added').map((line) => lineId(line.line as number)),
    firstLine: numbered.length > 0 ? Math.min(...numbered) : 1,
  };
}

// Pack hunks into windows on hunk boundaries first; a hunk that cannot fit an empty window is split
// on lines and its pieces packed like any other hunk.
export function buildWindows(hunks: ReadonlyArray<Hunk>, limits: WindowLimits): Array<Window> {
  const pieces = hunks.flatMap((hunk) => fits(hunk.lines, limits) ? [ hunk ] : splitHunk(hunk, limits));
  const groups: Array<Array<Hunk>> = [];
  let current: Array<Hunk> = [];
  for (const piece of pieces) {
    const combined = [ ...current, piece ].flatMap((hunk) => hunk.lines);
    if (current.length > 0 && !fits(combined, limits)) {
      groups.push(current);
      current = [];
    }
    current.push(piece);
  }
  if (current.length > 0) groups.push(current);
  return groups.map(toWindow);
}
