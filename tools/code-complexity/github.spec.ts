import { describe, it, expect } from 'vitest';

import { githubAnnotations, stepSummary } from './github';
import type { ReportRow } from './report';

const THRESHOLDS = { maxComplexityJsx: 25, maxComplexityBehavior: 20, maxCrap: 30 };

function row(overrides: Partial<ReportRow>): ReportRow {
  return {
    file: 'src/f.ts',
    line: 1,
    name: 'fn',
    kind: 'behavior',
    complexity: 1,
    coverage: null,
    crap: null,
    brokeComplexity: false,
    brokeCrap: false,
    ...overrides,
  };
}

describe('githubAnnotations', () => {
  it('emits one ::error per offender, pointing at its file and line', () => {
    const annotations = githubAnnotations([
      row({ file: 'src/a.ts', line: 12, name: 'big', complexity: 25, brokeComplexity: true }),
      row({ file: 'src/b.ts', line: 3, name: 'ok' }),
    ], THRESHOLDS);
    expect(annotations).toEqual([ '::error file=src/a.ts,line=12::big: complexity 25 > 20' ]);
  });

  it('names both thresholds when a function breaks both', () => {
    const [ annotation ] = githubAnnotations([
      row({ name: 'both', complexity: 25, coverage: 0, crap: 90, brokeComplexity: true, brokeCrap: true }),
    ], THRESHOLDS);
    expect(annotation).toBe('::error file=src/f.ts,line=1::both: complexity 25 > 20; CRAP 90.0 > 30');
  });

  it('names the jsx cap for a jsx offender', () => {
    const [ annotation ] = githubAnnotations([
      row({ name: 'render', kind: 'jsx', complexity: 30, brokeComplexity: true }),
    ], THRESHOLDS);
    expect(annotation).toBe('::error file=src/f.ts,line=1::render: complexity 30 > 25');
  });

  it('returns nothing when no function broke a threshold', () => {
    expect(githubAnnotations([ row({ crap: 3, coverage: 1 }) ], THRESHOLDS)).toEqual([]);
  });
});

describe('stepSummary', () => {
  it('fences the table under a heading so the job summary keeps its alignment', () => {
    const summary = stepSummary('FUNCTION  CX\nsrc/f.ts   1');
    expect(summary).toContain('## Cyclomatic complexity & CRAP gate');
    expect(summary).toContain('```\nFUNCTION  CX\nsrc/f.ts   1\n```');
  });
});
