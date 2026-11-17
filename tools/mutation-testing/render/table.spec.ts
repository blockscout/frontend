import { describe, expect, it } from 'vitest';

import type { FileScore } from '../stryker/report';
import { formatTable } from './table';

function score(file: string, killed: number, survived: number, noCoverage = 0): FileScore {
  const mutants = killed + survived + noCoverage;
  return { file, mutants, killed, survived, noCoverage, score: mutants === 0 ? null : (killed / mutants) * 100 };
}

describe('formatTable', () => {
  it('renders a column per metric, right-aligned under its header', () => {
    expect(formatTable([ score('src/a.ts', 3, 1) ])).toBe([
      'FILE      SCORE  MUTANTS  KILLED  SURVIVED  NO-COV',
      'src/a.ts    75%        4       3         1       0',
      '',
      '1 file(s), 4 mutant(s): 3 killed, 1 survived, 0 without coverage — score 75%.',
    ].join('\n'));
  });

  it('leads with the worst-scoring file', () => {
    const table = formatTable([ score('src/good.ts', 4, 0), score('src/bad.ts', 1, 3) ]);
    expect(table.indexOf('src/bad.ts')).toBeLessThan(table.indexOf('src/good.ts'));
  });

  it('sinks a file with no scored mutants below every scored one', () => {
    const table = formatTable([ score('src/none.ts', 0, 0), score('src/perfect.ts', 4, 0) ]);
    expect(table.indexOf('src/perfect.ts')).toBeLessThan(table.indexOf('src/none.ts'));
    expect(table).toContain('src/none.ts         —        0       0         0       0');
  });

  it('weighs the overall score by mutant count rather than averaging the per-file scores', () => {
    // Averaging the rows would read 50%; the mutant-weighted score is 10 killed out of 11.
    expect(formatTable([ score('src/big.ts', 10, 0), score('src/small.ts', 0, 1) ]))
      .toContain('2 file(s), 11 mutant(s): 10 killed, 1 survived, 0 without coverage — score 91%.');
  });

  it('summarises a run where nothing was scored without dividing by zero', () => {
    expect(formatTable([ score('src/none.ts', 0, 0) ]))
      .toContain('1 file(s), 0 mutant(s): 0 killed, 0 survived, 0 without coverage — score —.');
  });

  it('counts mutants nothing covered separately from survivors', () => {
    expect(formatTable([ score('src/a.ts', 1, 1, 2) ]))
      .toContain('1 file(s), 4 mutant(s): 1 killed, 1 survived, 2 without coverage — score 25%.');
  });
});
