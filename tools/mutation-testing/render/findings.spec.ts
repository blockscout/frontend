import { describe, expect, it } from 'vitest';

import type { Findings } from '../stryker/report';
import { formatFindings } from './findings';

const EMPTY: Findings = { survivors: [], noCoverage: [] };

describe('formatFindings', () => {
  it('names every mutator that survived on one line as a single finding under its file', () => {
    const findings: Findings = {
      survivors: [ {
        file: 'src/a.ts',
        lines: [
          { line: 12, mutators: [ { name: 'ConditionalExpression', count: 1 }, { name: 'LogicalOperator', count: 1 } ] },
          { line: 130, mutators: [ { name: 'EqualityOperator', count: 1 } ] },
        ],
      } ],
      noCoverage: [],
    };

    expect(formatFindings(findings)).toBe([
      'SURVIVED — these changes were made and no test failed:',
      '',
      'src/a.ts',
      '  L 12  ConditionalExpression, LogicalOperator',
      '  L130  EqualityOperator',
    ].join('\n'));
  });

  it('counts repeats of a mutator on one line instead of listing it twice', () => {
    const findings: Findings = {
      survivors: [ { file: 'src/a.ts', lines: [ { line: 4, mutators: [ { name: 'BooleanLiteral', count: 3 } ] } ] } ],
      noCoverage: [],
    };

    expect(formatFindings(findings)).toContain('L4  BooleanLiteral ×3');
  });

  it('separates the files it groups under', () => {
    const findings: Findings = {
      survivors: [
        { file: 'src/a.ts', lines: [ { line: 1, mutators: [ { name: 'LogicalOperator', count: 1 } ] } ] },
        { file: 'src/b.ts', lines: [ { line: 2, mutators: [ { name: 'LogicalOperator', count: 1 } ] } ] },
      ],
      noCoverage: [],
    };

    expect(formatFindings(findings)).toBe([
      'SURVIVED — these changes were made and no test failed:',
      '',
      'src/a.ts',
      '  L1  LogicalOperator',
      '',
      'src/b.ts',
      '  L2  LogicalOperator',
    ].join('\n'));
  });

  it('summarises the uncovered mutants on one line, whatever they span', () => {
    const findings: Findings = {
      survivors: [],
      noCoverage: [ { file: 'src/a.ts', mutants: 5 }, { file: 'src/b.ts', mutants: 2 } ],
    };

    expect(formatFindings(findings)).toBe(
      'NO COVERAGE — 7 mutant(s) on 2 file(s) ran no test at all, which the CRAP gate covers: src/a.ts (5), src/b.ts (2).',
    );
  });

  it('prints both findings as separate sections when a run has both', () => {
    const findings: Findings = {
      survivors: [ { file: 'src/a.ts', lines: [ { line: 9, mutators: [ { name: 'EqualityOperator', count: 1 } ] } ] } ],
      noCoverage: [ { file: 'src/a.ts', mutants: 1 } ],
    };

    expect(formatFindings(findings)).toBe([
      'SURVIVED — these changes were made and no test failed:',
      '',
      'src/a.ts',
      '  L9  EqualityOperator',
      '',
      'NO COVERAGE — 1 mutant(s) on 1 file(s) ran no test at all, which the CRAP gate covers: src/a.ts (1).',
    ].join('\n'));
  });

  it('says a clean run is clean in one line rather than printing empty sections', () => {
    expect(formatFindings(EMPTY)).toBe('No survivors and no uncovered mutants — nothing to act on.');
  });
});
