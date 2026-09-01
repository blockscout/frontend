import { describe, it, expect } from 'vitest';

import type { Contribution } from '../measure/complexity';
import { githubAnnotations, stepSummary } from './github';
import type { ReportRow } from './report';

const THRESHOLDS = { maxCognitiveJsx: 25, maxCognitiveBehavior: 20, maxCrap: 30 };

function row(overrides: Partial<ReportRow>): ReportRow {
  return {
    file: 'src/f.ts',
    line: 1,
    name: 'fn',
    kind: 'behavior',
    complexity: 1,
    cognitive: 1,
    contributions: [],
    coverage: null,
    crap: null,
    brokeCognitive: false,
    brokeCrap: false,
    ...overrides,
  };
}

// A cognitive-complexity offender's increment sites: a shallow if and a deeply-nested one.
const CONTRIBUTIONS: Array<Contribution> = [
  { line: 3, amount: 1, reason: 'if', nesting: 0 },
  { line: 5, amount: 5, reason: 'if', nesting: 2 },
];

describe('githubAnnotations', () => {
  it('emits one actionable ::error per cognitive offender, naming top sites and the deepest pocket', () => {
    const annotations = githubAnnotations([
      row({ file: 'src/a.ts', line: 12, name: 'big', kind: 'behavior', cognitive: 25, brokeCognitive: true, contributions: CONTRIBUTIONS }),
      row({ file: 'src/b.ts', line: 3, name: 'ok' }),
    ], THRESHOLDS);
    expect(annotations).toEqual([
      '::error file=src/a.ts,line=12::big: cognitive 25 > 20 [top: if +5 (L5), if +1 (L3); deepest nesting 2 at L5, flattening saves ~3]',
    ]);
  });

  it('omits the deepest-pocket clause when nothing is nested', () => {
    const [ annotation ] = githubAnnotations([
      row({ name: 'flat', cognitive: 21, brokeCognitive: true, contributions: [ { line: 2, amount: 1, reason: 'switch', nesting: 0 } ] }),
    ], THRESHOLDS);
    expect(annotation).toBe('::error file=src/f.ts,line=1::flat: cognitive 21 > 20 [top: switch +1 (L2)]');
  });

  it('names both thresholds when a function breaks both', () => {
    const [ annotation ] = githubAnnotations([
      row({ name: 'both', cognitive: 25, coverage: 0, crap: 90, brokeCognitive: true, brokeCrap: true, contributions: CONTRIBUTIONS }),
    ], THRESHOLDS);
    const cognitivePart = 'cognitive 25 > 20 [top: if +5 (L5), if +1 (L3); deepest nesting 2 at L5, flattening saves ~3]';
    expect(annotation).toBe(`::error file=src/f.ts,line=1::both: ${ cognitivePart }; CRAP 90.0 > 30`);
  });

  it('emits only the CRAP clause for a CRAP-only offender', () => {
    const [ annotation ] = githubAnnotations([
      row({ name: 'crapOnly', coverage: 0, crap: 72, brokeCrap: true }),
    ], THRESHOLDS);
    expect(annotation).toBe('::error file=src/f.ts,line=1::crapOnly: CRAP 72.0 > 30');
  });

  it('names the jsx cap for a jsx offender', () => {
    const [ annotation ] = githubAnnotations([
      row({ name: 'render', kind: 'jsx', cognitive: 30, brokeCognitive: true, contributions: [ { line: 4, amount: 1, reason: 'ternary', nesting: 0 } ] }),
    ], THRESHOLDS);
    expect(annotation).toBe('::error file=src/f.ts,line=1::render: cognitive 30 > 25 [top: ternary +1 (L4)]');
  });

  it('returns nothing when no function broke a threshold', () => {
    expect(githubAnnotations([ row({ crap: 3, coverage: 1 }) ], THRESHOLDS)).toEqual([]);
  });
});

describe('stepSummary', () => {
  it('fences the table under a heading so the job summary keeps its alignment', () => {
    const summary = stepSummary('FUNCTION  COG\nsrc/f.ts    1');
    expect(summary).toContain('## Cognitive complexity & CRAP gate');
    expect(summary).toContain('```\nFUNCTION  COG\nsrc/f.ts    1\n```');
  });
});
