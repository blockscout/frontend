import { describe, it, expect } from 'vitest';

import { buildFileRows } from './analyze';
import type { BuildOptions } from './analyze';
import type { CoverageData, LineHits } from './coverage';

const THRESHOLDS = { maxComplexity: 20, maxCrap: 30 };

// Build BuildOptions with sensible defaults (logic file, diff-style 0%-for-missing, gate all),
// overridable per test.
function opts(overrides: Partial<BuildOptions> = {}): BuildOptions {
  return {
    thresholds: THRESHOLDS,
    gate: () => true,
    coverageApplies: true,
    missingCoverageIsZero: true,
    ...overrides,
  };
}

// A stub coverage report: given line hits keyed by relative path, hand them back on lookup.
function coverageStub(byPath: Record<string, ReadonlyArray<[ number, number ]>>): CoverageData {
  return {
    lineHitsFor(relativePath: string): LineHits | undefined {
      const entry = byPath[relativePath];
      return entry ? new Map(entry) : undefined;
    },
  };
}

// A high-complexity body: base 1 + 7 `&&` = complexity 8, on one line so coverage maps to it.
const COMPLEX_LOGIC = 'export function f(a: any) { return a && a && a && a && a && a && a && a; }';
const COMPLEX_JSX = 'export const C = (a: any) => <div>{ a && a && a && a && a && a && a && a }</div>;';

describe('buildFileRows — CRAP gate (coverage applies)', () => {
  it('computes CRAP from joined coverage', () => {
    // complexity 8, coverage 0 -> CRAP 8² + 8 = 72, over the cap of 30
    const rows = buildFileRows('src/f.ts', COMPLEX_LOGIC, coverageStub({ 'src/f.ts': [ [ 1, 0 ] ] }), opts());
    expect(rows).toHaveLength(1);
    expect(rows[0].complexity).toBe(8);
    expect(rows[0].coverage).toBe(0);
    expect(rows[0].crap).toBe(72);
    expect(rows[0].brokeCrap).toBe(true);
    expect(rows[0].brokeComplexity).toBe(false); // 8 is under the complexity cap of 20
  });

  it('lowers CRAP below the cap when the function is well covered', () => {
    // the whole function sits on line 1; mark it executed -> coverage 1 -> CRAP = complexity 8
    const rows = buildFileRows('src/f.ts', COMPLEX_LOGIC, coverageStub({ 'src/f.ts': [ [ 1, 3 ] ] }), opts());
    expect(rows[0].coverage).toBe(1);
    expect(rows[0].crap).toBe(8);
    expect(rows[0].brokeCrap).toBe(false);
  });
});

describe('buildFileRows — file absent from the coverage report', () => {
  const absent = coverageStub({ 'src/other.ts': [] });

  it('scores 0% and flags it when missing means untested (generated/CI coverage)', () => {
    const rows = buildFileRows('src/missing.ts', COMPLEX_LOGIC, absent, opts({ missingCoverageIsZero: true }));
    expect(rows[0].coverage).toBe(0);
    expect(rows[0].crap).toBe(72);
    expect(rows[0].brokeCrap).toBe(true);
  });

  it('reports no coverage data (— / no CRAP) when missing means "no data" (user --coverage-file)', () => {
    const rows = buildFileRows('src/missing.ts', COMPLEX_LOGIC, absent, opts({ missingCoverageIsZero: false }));
    expect(rows[0].coverage).toBeNull();
    expect(rows[0].crap).toBeNull();
    expect(rows[0].brokeCrap).toBe(false);
  });
});

describe('buildFileRows — coverage applicability', () => {
  it('a JSX component without a spec gets the complexity gate only (coverageApplies false)', () => {
    const rows = buildFileRows('src/C.tsx', COMPLEX_JSX, coverageStub({}), opts({ coverageApplies: false }));
    expect(rows[0].complexity).toBe(8);
    expect(rows[0].coverage).toBeNull();
    expect(rows[0].crap).toBeNull();
    expect(rows[0].brokeCrap).toBe(false);
  });

  it('still breaks the complexity gate when over the cap, coverage aside', () => {
    const rows = buildFileRows('src/C.tsx', COMPLEX_JSX, coverageStub({}), opts({ coverageApplies: false, thresholds: { maxComplexity: 5, maxCrap: 30 } }));
    expect(rows[0].brokeComplexity).toBe(true);
  });

  it('a JSX component WITH a spec gets the CRAP gate (coverageApplies true)', () => {
    // behavior-tested component: coverage joins and CRAP is computed just like a logic file
    const rows = buildFileRows('src/C.tsx', COMPLEX_JSX, coverageStub({ 'src/C.tsx': [ [ 1, 0 ] ] }), opts({ coverageApplies: true }));
    expect(rows[0].coverage).toBe(0);
    expect(rows[0].crap).toBe(72);
    expect(rows[0].brokeCrap).toBe(true);
  });
});

describe('buildFileRows — no coverage report', () => {
  it('runs the complexity gate alone, leaving coverage/CRAP null', () => {
    const rows = buildFileRows('src/f.ts', COMPLEX_LOGIC, null, opts({ thresholds: { maxComplexity: 5, maxCrap: 30 } }));
    expect(rows[0].coverage).toBeNull();
    expect(rows[0].crap).toBeNull();
    expect(rows[0].brokeComplexity).toBe(true);
    expect(rows[0].brokeCrap).toBe(false);
  });
});

describe('buildFileRows — gate scoping', () => {
  it('never flags a function the gate excludes, even over threshold', () => {
    const rows = buildFileRows('src/f.ts', COMPLEX_LOGIC, coverageStub({ 'src/f.ts': [ [ 1, 0 ] ] }), opts({ gate: () => false }));
    expect(rows[0].crap).toBe(72); // still reported...
    expect(rows[0].brokeCrap).toBe(false); // ...but not flagged
    expect(rows[0].brokeComplexity).toBe(false);
  });
});
