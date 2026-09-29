import { describe, expect, it } from 'vitest';

import type { Hunk, StateLine } from './hunks';
import { buildWindows, parseLineId, parseUnifiedDiff, renderLine, wholeFileHunk } from './hunks';

const DIFF = [
  'diff --git a/src/f.ts b/src/f.ts',
  'index 1111111..2222222 100644',
  '--- a/src/f.ts',
  '+++ b/src/f.ts',
  '@@ -3,4 +3,5 @@ function f() {',
  '   keep();',
  '-  old();',
  '+  fresh();',
  '+  extra();',
  '   tail();',
  '@@ -40,2 +41,2 @@',
  '   before();',
  '-  gone();',
  '+  here();',
  '\\ No newline at end of file',
].join('\n');

function added(line: number, text: string): StateLine {
  return { kind: 'added', line, text };
}

// Every line renders to the same width, so limits count lines predictably: `L1 + xxxxxxxxxx` is 15
// chars plus the newline.
function hunkOfAddedLines(count: number, firstLine: number = 1): Hunk {
  return { lines: Array.from({ length: count }, (_, index) => added(firstLine + index, 'xxxxxxxxxx')) };
}

const RENDERED_LINE_CHARS = 16;

describe('parseUnifiedDiff', () => {
  it('numbers context and added lines on the new side and leaves removed lines unnumbered', () => {
    expect(parseUnifiedDiff(DIFF)).toEqual([
      { lines: [
        { kind: 'context', line: 3, text: '  keep();' },
        { kind: 'removed', text: '  old();' },
        added(4, '  fresh();'),
        added(5, '  extra();'),
        { kind: 'context', line: 6, text: '  tail();' },
      ] },
      { lines: [
        { kind: 'context', line: 41, text: '  before();' },
        { kind: 'removed', text: '  gone();' },
        added(42, '  here();'),
      ] },
    ]);
  });

  it('takes hunk lines only after a hunk header, so a preamble starting with --- or +++ is not a line', () => {
    expect(parseUnifiedDiff('--- a/f\n+++ b/f\n@@ -1 +1 @@\n+a\n')).toEqual([ { lines: [ added(1, 'a') ] } ]);
  });

  it('stops a hunk at the next file header instead of reading it as context', () => {
    const twoFiles = `${ DIFF }\ndiff --git a/src/g.ts b/src/g.ts\nindex 3333333..4444444 100644\n--- a/src/g.ts\n+++ b/src/g.ts\n@@ -1 +1 @@\n-x\n+y`;
    const hunks = parseUnifiedDiff(twoFiles);
    expect(hunks).toHaveLength(3);
    expect(hunks[1].lines).toHaveLength(3);
    expect(hunks[2]).toEqual({ lines: [ { kind: 'removed', text: 'x' }, added(1, 'y') ] });
  });

  it('yields no hunk for a diff without one', () => {
    expect(parseUnifiedDiff('Binary files a/x.png and b/x.png differ\n')).toEqual([]);
    expect(parseUnifiedDiff('')).toEqual([]);
  });
});

describe('wholeFileHunk', () => {
  it('marks every line as added, numbered from 1, without a phantom trailing line', () => {
    expect(wholeFileHunk('a\nb\n')).toEqual({ lines: [ added(1, 'a'), added(2, 'b') ] });
  });
});

describe('renderLine', () => {
  it('prefixes numbered lines with their id and marks removed lines without one', () => {
    expect(renderLine(added(12, 'x')).startsWith('L12 + x')).toBe(true);
    expect(renderLine({ kind: 'context', line: 7, text: 'y' })).toMatch(/^L7 {3}y$/);
    expect(renderLine({ kind: 'removed', text: 'z' })).toMatch(/^ +- z$/);
  });
});

describe('parseLineId', () => {
  it('reads the number back from an id and rejects anything else', () => {
    expect(parseLineId('L42')).toBe(42);
    expect(parseLineId('42')).toBeUndefined();
    expect(parseLineId('Lx')).toBeUndefined();
  });
});

describe('buildWindows', () => {
  const roomy = { maxChars: 10_000, maxChangedLines: 1_000 };

  it('puts every hunk in one window when they fit, with the changed ids and the first line', () => {
    const windows = buildWindows(parseUnifiedDiff(DIFF), roomy);
    expect(windows).toHaveLength(1);
    expect(windows[0]).toMatchObject({ index: 0, changedIds: [ 'L4', 'L5', 'L42' ], firstLine: 3, lastLine: 42 });
    expect(windows[0].state).toContain('L4 +   fresh();');
    expect(windows[0].state).toContain('\n@@\n');
  });

  it('splits on hunk boundaries before cutting a hunk', () => {
    const hunks = [ hunkOfAddedLines(3, 1), hunkOfAddedLines(3, 50), hunkOfAddedLines(3, 90) ];
    const windows = buildWindows(hunks, { maxChars: 4 * RENDERED_LINE_CHARS + 2, maxChangedLines: 1_000 });
    expect(windows.map((window) => window.changedIds)).toEqual([
      [ 'L1', 'L2', 'L3' ],
      [ 'L50', 'L51', 'L52' ],
      [ 'L90', 'L91', 'L92' ],
    ]);
    expect(windows.map((window) => window.index)).toEqual([ 0, 1, 2 ]);
  });

  it('cuts a hunk on lines when it cannot fit an empty window', () => {
    const windows = buildWindows([ hunkOfAddedLines(5) ], { maxChars: 2 * RENDERED_LINE_CHARS, maxChangedLines: 1_000 });
    expect(windows.map((window) => window.changedIds)).toEqual([ [ 'L1', 'L2' ], [ 'L3', 'L4' ], [ 'L5' ] ]);
  });

  it('counts the newline between rendered lines against the character budget', () => {
    const windows = buildWindows([ hunkOfAddedLines(2) ], { maxChars: 2 * RENDERED_LINE_CHARS - 1, maxChangedLines: 1_000 });
    expect(windows.map((window) => window.changedIds)).toEqual([ [ 'L1' ], [ 'L2' ] ]);
  });

  it('caps the changed lines per window so the locate step never exceeds the option limit', () => {
    const windows = buildWindows([ hunkOfAddedLines(7) ], { maxChars: 10_000, maxChangedLines: 3 });
    expect(windows.map((window) => window.changedIds.length)).toEqual([ 3, 3, 1 ]);
  });

  it('counts added lines only against the changed-lines cap, not context or removed ones', () => {
    const mixed: Hunk = { lines: [
      { kind: 'context', line: 1, text: 'a' },
      added(2, 'b'),
      { kind: 'removed', text: 'c' },
      { kind: 'context', line: 3, text: 'd' },
      added(4, 'e'),
    ] };
    const windows = buildWindows([ mixed ], { maxChars: 10_000, maxChangedLines: 2 });
    expect(windows.map((window) => window.changedIds)).toEqual([ [ 'L2', 'L4' ] ]);
  });

  it('keeps a single line longer than the budget as its own window', () => {
    const long: Hunk = { lines: [ added(1, 'x'.repeat(100)), added(2, 'y') ] };
    const windows = buildWindows([ long ], { maxChars: 20, maxChangedLines: 1_000 });
    expect(windows.map((window) => window.changedIds)).toEqual([ [ 'L1' ], [ 'L2' ] ]);
  });

  it('falls back to line 1 for a window with no numbered line', () => {
    const removedOnly: Hunk = { lines: [ { kind: 'removed', text: 'x' } ] };
    expect(buildWindows([ removedOnly ], roomy)[0]).toMatchObject({ changedIds: [], firstLine: 1, lastLine: 1 });
  });

  it('yields no window for no hunks', () => {
    expect(buildWindows([], roomy)).toEqual([]);
  });
});
