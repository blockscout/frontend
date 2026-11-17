import fs from 'fs';
import os from 'os';
import path from 'path';

import { describe, it, expect } from 'vitest';

import { parseCoverage, functionLineCoverage, readCoverageOrEmpty } from './read';

// A minimal istanbul-shaped report: one statement per line, `s` giving each line's hit count.
function reportFor(absolutePath: string, hitsByLine: Record<number, number>): string {
  const statementMap: Record<string, { start: { line: number }; end: { line: number } }> = {};
  const s: Record<string, number> = {};
  Object.entries(hitsByLine).forEach(([ line, hits ], index) => {
    const id = String(index);
    statementMap[id] = { start: { line: Number(line) }, end: { line: Number(line) } };
    s[id] = hits;
  });
  return JSON.stringify({ [absolutePath]: { path: absolutePath, statementMap, s } });
}

describe('parseCoverage + lineHitsFor', () => {
  it('matches a repo-relative path against the absolute key by suffix', () => {
    const data = parseCoverage(reportFor('/Users/dev/frontend/src/lib/foo.ts', { '1': 3, '2': 0 }));
    const lineHits = data.lineHitsFor('src/lib/foo.ts');
    expect(lineHits).toBeDefined();
    expect(lineHits?.get(1)).toBe(3);
    expect(lineHits?.get(2)).toBe(0);
  });

  it('returns undefined for a file absent from the report', () => {
    const data = parseCoverage(reportFor('/Users/dev/frontend/src/lib/foo.ts', { '1': 1 }));
    expect(data.lineHitsFor('src/lib/bar.ts')).toBeUndefined();
  });

  it('takes the highest count among statements sharing a line', () => {
    const raw = JSON.stringify({
      '/x/src/f.ts': {
        path: '/x/src/f.ts',
        statementMap: { a: { start: { line: 5 } }, b: { start: { line: 5 } } },
        s: { a: 0, b: 4 },
      },
    });
    expect(parseCoverage(raw).lineHitsFor('src/f.ts')?.get(5)).toBe(4);
  });
});

describe('readCoverageOrEmpty', () => {
  it('reads a report that is there', () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'crap-cov-spec-'));
    const file = path.join(directory, 'coverage-final.json');
    try {
      fs.writeFileSync(file, reportFor('/x/src/f.ts', { '1': 1 }));
      expect(readCoverageOrEmpty(file).lineHitsFor('src/f.ts')?.get(1)).toBe(1);
    } finally {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  });

  // A run that selected no specs writes no report. Empty coverage scores its behavior functions 0%;
  // throwing ENOENT would fail the CI job instead of gating the untested code.
  it('reads an absent report as empty coverage rather than throwing', () => {
    const data = readCoverageOrEmpty(path.join(os.tmpdir(), 'crap-cov-spec-nonexistent', 'coverage-final.json'));
    expect(data.lineHitsFor('src/f.ts')).toBeUndefined();
  });
});

describe('functionLineCoverage', () => {
  const lineHits = new Map<number, number>([ [ 10, 2 ], [ 11, 0 ], [ 12, 5 ], [ 13, 0 ], [ 20, 1 ] ]);

  it('is the fraction of coverable lines executed within the range', () => {
    // lines 10-13: 4 coverable, 2 executed (10, 12) -> 0.5
    expect(functionLineCoverage(lineHits, 10, 13)).toBe(0.5);
  });

  it('ignores lines outside the range', () => {
    // only line 20 in range, executed -> 1
    expect(functionLineCoverage(lineHits, 20, 25)).toBe(1);
  });

  it('treats a range with no coverable lines as fully covered', () => {
    expect(functionLineCoverage(lineHits, 100, 110)).toBe(1);
  });
});
