import { describe, expect, it } from 'vitest';

import type { Findings } from '../stryker/report';
import { githubAnnotations, stepSummary, truncationAnnotation } from './github';

const NO_FINDINGS: Findings = { survivors: [], noCoverage: [] };

describe('githubAnnotations', () => {
  it('anchors one error to each surviving line, naming the mutators that survived on it', () => {
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

    expect(githubAnnotations(findings)).toEqual([
      '::error file=src/a.ts,line=12::Mutant survived: ConditionalExpression, LogicalOperator — this change was made here and no test failed.',
      '::error file=src/a.ts,line=130::Mutant survived: EqualityOperator — this change was made here and no test failed.',
    ]);
  });

  it('carries the repeat count of a mutator into the annotation', () => {
    const findings: Findings = {
      survivors: [ { file: 'src/a.ts', lines: [ { line: 4, mutators: [ { name: 'BooleanLiteral', count: 3 } ] } ] } ],
      noCoverage: [],
    };

    expect(githubAnnotations(findings)[0]).toContain('BooleanLiteral ×3');
  });

  it('annotates every file a run found survivors in', () => {
    const findings: Findings = {
      survivors: [
        { file: 'src/a.ts', lines: [ { line: 1, mutators: [ { name: 'LogicalOperator', count: 1 } ] } ] },
        { file: 'tools/b.ts', lines: [ { line: 2, mutators: [ { name: 'LogicalOperator', count: 1 } ] } ] },
      ],
      noCoverage: [],
    };

    expect(githubAnnotations(findings).map((annotation) => annotation.split('::')[1])).toEqual([
      'error file=src/a.ts,line=1',
      'error file=tools/b.ts,line=2',
    ]);
  });

  it('annotates nothing when a run only found mutants no test covered', () => {
    expect(githubAnnotations({ survivors: [], noCoverage: [ { file: 'src/a.ts', mutants: 5 } ] })).toEqual([]);
  });

  it('annotates nothing when a run found nothing', () => {
    expect(githubAnnotations(NO_FINDINGS)).toEqual([]);
  });

  it('keeps a message on one line, since a newline would truncate the directive', () => {
    const findings: Findings = {
      survivors: [ { file: 'src/a.ts', lines: [ { line: 1, mutators: [ { name: 'Logical\nOperator', count: 1 } ] } ] } ],
      noCoverage: [],
    };

    expect(githubAnnotations(findings)[0]).toBe(
      '::error file=src/a.ts,line=1::Mutant survived: Logical Operator — this change was made here and no test failed.',
    );
  });
});

describe('truncationAnnotation', () => {
  it('reports a truncated run as a warning, so it is visible without failing the gate', () => {
    expect(truncationAnnotation('Run TRUNCATED: the 15 min budget expired')).toBe(
      '::warning::Run TRUNCATED: the 15 min budget expired',
    );
  });

  it('flattens a multi-line notice onto the single line a directive allows', () => {
    expect(truncationAnnotation('Run TRUNCATED\nRaise the budget')).toBe('::warning::Run TRUNCATED Raise the budget');
  });
});

describe('stepSummary', () => {
  it('fences the report so the score table keeps its column alignment once rendered as markdown', () => {
    expect(stepSummary('FILE      SCORE\nsrc/a.ts    80%')).toBe(
      '## Mutation testing\n\n```\nFILE      SCORE\nsrc/a.ts    80%\n```\n',
    );
  });

  it('carries the report through verbatim, so the summary and the log say the same thing', () => {
    const report = 'FILE\n\nSURVIVED — 1 mutant(s) on 1 file(s):\n  src/a.ts:12 ConditionalExpression';

    expect(stepSummary(report)).toContain(report);
  });
});
