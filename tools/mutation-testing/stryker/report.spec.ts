import { describe, expect, it } from 'vitest';

import type { Mutant, MutantStatus, MutationReport } from './report';
import { buildFileScores, parseReport } from './report';

const LINE = 10;

function mutant(status: MutantStatus, mutatorName = 'EqualityOperator'): Mutant {
  return {
    id: `${ status }-${ mutatorName }`,
    mutatorName,
    status,
    location: { start: { line: LINE, column: 1 }, end: { line: LINE, column: 20 } },
  };
}

function reportOf(statuses: ReadonlyArray<MutantStatus>): MutationReport {
  return { files: { 'src/a.ts': { mutants: statuses.map((status) => mutant(status)) } } };
}

describe('buildFileScores', () => {
  it('scores a file off the killed share of its scored mutants', () => {
    expect(buildFileScores(reportOf([ 'Killed', 'Killed', 'Survived', 'NoCoverage' ]))).toEqual([ {
      file: 'src/a.ts',
      mutants: 4,
      killed: 2,
      survived: 1,
      noCoverage: 1,
      score: 50,
    } ]);
  });

  it('counts a timeout as killed, the way Stryker scores it', () => {
    expect(buildFileScores(reportOf([ 'Timeout', 'Survived' ]))[0]).toMatchObject({ mutants: 2, killed: 1, survived: 1, score: 50 });
  });

  it('leaves the excluded mutators and the error statuses out of the score entirely', () => {
    expect(buildFileScores(reportOf([ 'Killed', 'Ignored', 'CompileError', 'RuntimeError', 'Pending' ]))[0])
      .toMatchObject({ mutants: 1, killed: 1, survived: 0, noCoverage: 0, score: 100 });
  });

  it('scores a file with nothing but excluded mutants as null rather than zero', () => {
    expect(buildFileScores(reportOf([ 'Ignored' ]))[0]).toMatchObject({ mutants: 0, killed: 0, score: null });
  });

  it('returns one row per file in the report', () => {
    const report = {
      files: {
        'src/a.ts': { mutants: [ mutant('Killed') ] },
        'src/b.ts': { mutants: [ mutant('Survived') ] },
      },
    };
    expect(buildFileScores(report).map((row) => row.file)).toEqual([ 'src/a.ts', 'src/b.ts' ]);
  });

  it('produces no rows when Stryker mutated nothing', () => {
    expect(buildFileScores({ files: {} })).toEqual([]);
  });
});

describe('parseReport', () => {
  it('reads the mutants out of the reporter JSON', () => {
    const json = [
      '{"files":{"src/a.ts":{"mutants":[{"id":"1","mutatorName":"LogicalOperator",',
      '"status":"Survived","location":{"start":{"line":3,"column":1},"end":{"line":3,"column":9}}}]}}}',
    ].join('');
    expect(buildFileScores(parseReport(json))).toEqual([ {
      file: 'src/a.ts',
      mutants: 1,
      killed: 0,
      survived: 1,
      noCoverage: 0,
      score: 0,
    } ]);
  });
});
