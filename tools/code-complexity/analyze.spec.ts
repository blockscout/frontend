import { describe, it, expect } from 'vitest';

import { buildFileRows } from './analyze';
import type { BuildOptions } from './analyze';
import type { CoverageData, LineHits } from './coverage';

const THRESHOLDS = { maxCognitiveJsx: 20, maxCognitiveBehavior: 20, maxCrap: 30 };

// Build BuildOptions with sensible defaults (diff-style 0%-for-missing, gate all), overridable
// per test.
function opts(overrides: Partial<BuildOptions> = {}): BuildOptions {
  return {
    thresholds: THRESHOLDS,
    gate: () => true,
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

// A wide-but-shallow body: cyclomatic 8 (base 1 + 7 `&&`), but cognitive 1 — a single boolean run.
// It drives the CRAP tests (CRAP is fed by cyclomatic) and confirms flat logic scores near-zero
// cognitively. On one line so coverage maps to it. No JSX -> `behavior`.
const WIDE_LOGIC = 'export function f(a: any) { return a && a && a && a && a && a && a && a; }';

// A genuinely-nested body: three nested ifs -> cognitive 6 (1 + 2 + 3), cyclomatic 4. No JSX ->
// `behavior`; the JSX variant renders and so classifies `jsx`.
const NESTED_LOGIC = 'export function g(a: any, b: any, c: any) { if (a) { if (b) { if (c) { return 1; } } } return 0; }';
const NESTED_JSX = 'export const C = (a: any, b: any, c: any) => { if (a) { if (b) { if (c) { return <i/>; } } } return <b/>; };';

describe('buildFileRows — CRAP gate on behavior functions', () => {
  it('computes CRAP from cyclomatic complexity and joined coverage', () => {
    // cyclomatic 8, coverage 0 -> CRAP 8² + 8 = 72, over the cap of 30
    const rows = buildFileRows('src/f.ts', WIDE_LOGIC, coverageStub({ 'src/f.ts': [ [ 1, 0 ] ] }), opts());
    expect(rows).toHaveLength(1);
    expect(rows[0].kind).toBe('behavior');
    expect(rows[0].complexity).toBe(8);
    expect(rows[0].cognitive).toBe(1); // wide-but-shallow: a single && run
    expect(rows[0].coverage).toBe(0);
    expect(rows[0].crap).toBe(72);
    expect(rows[0].brokeCrap).toBe(true);
    expect(rows[0].brokeCognitive).toBe(false); // cognitive 1 is far under the behavior cap
  });

  it('lowers CRAP below the cap when the function is well covered', () => {
    // the whole function sits on line 1; mark it executed -> coverage 1 -> CRAP = cyclomatic 8
    const rows = buildFileRows('src/f.ts', WIDE_LOGIC, coverageStub({ 'src/f.ts': [ [ 1, 3 ] ] }), opts());
    expect(rows[0].coverage).toBe(1);
    expect(rows[0].crap).toBe(8);
    expect(rows[0].brokeCrap).toBe(false);
  });

  it('scores a behavior function the same way whatever the file extension', () => {
    // Living in a .tsx file does not make a JSX-less function `jsx`: classification is per-function.
    const rows = buildFileRows('src/C.tsx', WIDE_LOGIC, coverageStub({ 'src/C.tsx': [ [ 1, 0 ] ] }), opts());
    expect(rows[0].kind).toBe('behavior');
    expect(rows[0].crap).toBe(72);
    expect(rows[0].brokeCrap).toBe(true);
  });
});

describe('buildFileRows — behavior function absent from the coverage report', () => {
  const absent = coverageStub({ 'src/other.ts': [] });

  it('scores 0% and flags it when missing means untested (generated/CI coverage)', () => {
    const rows = buildFileRows('src/missing.ts', WIDE_LOGIC, absent, opts({ missingCoverageIsZero: true }));
    expect(rows[0].coverage).toBe(0);
    expect(rows[0].crap).toBe(72);
    expect(rows[0].brokeCrap).toBe(true);
  });

  it('reports no coverage data (— / no CRAP) when missing means "no data" (user --coverage-file)', () => {
    const rows = buildFileRows('src/missing.ts', WIDE_LOGIC, absent, opts({ missingCoverageIsZero: false }));
    expect(rows[0].coverage).toBeNull();
    expect(rows[0].crap).toBeNull();
    expect(rows[0].brokeCrap).toBe(false);
  });
});

describe('buildFileRows — jsx functions carry the cognitive cap only', () => {
  it('never scores CRAP on a jsx function, even with coverage present', () => {
    const rows = buildFileRows('src/C.tsx', NESTED_JSX, coverageStub({ 'src/C.tsx': [ [ 1, 0 ] ] }), opts());
    expect(rows[0].kind).toBe('jsx');
    expect(rows[0].cognitive).toBe(8);
    expect(rows[0].coverage).toBeNull();
    expect(rows[0].crap).toBeNull();
    expect(rows[0].brokeCrap).toBe(false);
  });

  it('still breaks the cognitive gate when over the jsx cap', () => {
    const thresholds = { maxCognitiveJsx: 5, maxCognitiveBehavior: 20, maxCrap: 30 };
    const rows = buildFileRows('src/C.tsx', NESTED_JSX, coverageStub({}), opts({ thresholds }));
    expect(rows[0].brokeCognitive).toBe(true); // cognitive 8 > jsx cap 5
  });
});

describe('buildFileRows — the two cognitive caps gate by class', () => {
  const thresholds = { maxCognitiveJsx: 20, maxCognitiveBehavior: 5, maxCrap: 30 };

  it('gates a jsx function against the jsx cap', () => {
    // cognitive 8: under the jsx cap of 20, so not flagged despite exceeding the behavior cap.
    const rows = buildFileRows('src/C.tsx', NESTED_JSX, null, opts({ thresholds }));
    expect(rows[0].kind).toBe('jsx');
    expect(rows[0].brokeCognitive).toBe(false);
  });

  it('gates a behavior function against the behavior cap', () => {
    // same cognitive 8: over the behavior cap of 5, so flagged.
    const rows = buildFileRows('src/f.ts', NESTED_LOGIC, null, opts({ thresholds }));
    expect(rows[0].kind).toBe('behavior');
    expect(rows[0].brokeCognitive).toBe(true);
  });
});

describe('buildFileRows — no coverage report', () => {
  it('runs the cognitive gate alone, leaving coverage/CRAP null', () => {
    const rows = buildFileRows('src/f.ts', NESTED_LOGIC, null, opts({ thresholds: { maxCognitiveJsx: 20, maxCognitiveBehavior: 5, maxCrap: 30 } }));
    expect(rows[0].coverage).toBeNull();
    expect(rows[0].crap).toBeNull();
    expect(rows[0].brokeCognitive).toBe(true);
    expect(rows[0].brokeCrap).toBe(false);
  });
});

describe('buildFileRows — gate scoping', () => {
  it('never flags a function the gate excludes, even over threshold', () => {
    const thresholds = { maxCognitiveJsx: 5, maxCognitiveBehavior: 5, maxCrap: 30 };
    const rows = buildFileRows('src/f.ts', NESTED_LOGIC, coverageStub({ 'src/f.ts': [ [ 1, 0 ] ] }), opts({ gate: () => false, thresholds }));
    expect(rows[0].cognitive).toBe(8); // still reported...
    expect(rows[0].brokeCognitive).toBe(false); // ...but not flagged
    expect(rows[0].brokeCrap).toBe(false);
  });
});
