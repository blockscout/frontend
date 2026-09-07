import { describe, expect, it } from 'vitest';

import type { Mutant, MutantStatus, MutationReport } from './report';
import { buildFileScores, collectFindings, isFailingRun, parseReport } from './report';

const LINE = 10;

function mutant(status: MutantStatus, mutatorName = 'EqualityOperator', line = LINE): Mutant {
  return {
    id: `${ status }-${ mutatorName }-${ line }`,
    mutatorName,
    status,
    location: { start: { line, column: 1 }, end: { line, column: 20 } },
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

describe('collectFindings', () => {
  const FIRST_LINE = 12;
  const SECOND_LINE = 30;

  it('groups the survivors on one line into a single finding naming every mutator', () => {
    const report = {
      files: {
        'src/a.ts': {
          mutants: [
            mutant('Survived', 'ConditionalExpression', FIRST_LINE),
            mutant('Survived', 'LogicalOperator', FIRST_LINE),
            mutant('Survived', 'EqualityOperator', SECOND_LINE),
          ],
        },
      },
    };

    expect(collectFindings(report).survivors).toEqual([ {
      file: 'src/a.ts',
      lines: [
        { line: FIRST_LINE, mutators: [ { name: 'ConditionalExpression', count: 1 }, { name: 'LogicalOperator', count: 1 } ] },
        { line: SECOND_LINE, mutators: [ { name: 'EqualityOperator', count: 1 } ] },
      ],
    } ]);
  });

  it('counts repeats of one mutator on a line rather than repeating its name', () => {
    const report = {
      files: {
        'src/a.ts': {
          mutants: [
            mutant('Survived', 'EqualityOperator', FIRST_LINE),
            mutant('Survived', 'EqualityOperator', FIRST_LINE),
          ],
        },
      },
    };

    expect(collectFindings(report).survivors[0].lines).toEqual([
      { line: FIRST_LINE, mutators: [ { name: 'EqualityOperator', count: 2 } ] },
    ]);
  });

  it('keeps mutants nothing covered out of the survivor listing, counting them separately', () => {
    const findings = collectFindings(reportOf([ 'Survived', 'NoCoverage', 'NoCoverage' ]));

    expect(findings.survivors[0].lines).toEqual([ { line: LINE, mutators: [ { name: 'EqualityOperator', count: 1 } ] } ]);
    expect(findings.noCoverage).toEqual([ { file: 'src/a.ts', mutants: 2 } ]);
  });

  it('splits off the status field, so nothing killed or excluded is reported as a finding', () => {
    expect(collectFindings(reportOf([ 'Killed', 'Timeout', 'Ignored', 'CompileError', 'RuntimeError', 'Pending' ])))
      .toEqual({ survivors: [], noCoverage: [] });
  });

  // Stryker reports the mutants of a file in whatever order it happened to test them, and two runs
  // over an unchanged tree must read identically.
  it('orders the lines of a file ascending, whatever order Stryker emitted them in', () => {
    const report = {
      files: {
        'src/a.ts': {
          mutants: [
            mutant('Survived', 'EqualityOperator', SECOND_LINE),
            mutant('Survived', 'EqualityOperator', FIRST_LINE),
          ],
        },
      },
    };

    expect(collectFindings(report).survivors[0].lines.map(({ line }) => line)).toEqual([ FIRST_LINE, SECOND_LINE ]);
  });

  it('orders the mutators of a line by name, whatever order Stryker emitted them in', () => {
    const report = {
      files: {
        'src/a.ts': {
          mutants: [
            mutant('Survived', 'LogicalOperator', FIRST_LINE),
            mutant('Survived', 'ConditionalExpression', FIRST_LINE),
          ],
        },
      },
    };

    expect(collectFindings(report).survivors[0].lines[0].mutators)
      .toEqual([ { name: 'ConditionalExpression', count: 1 }, { name: 'LogicalOperator', count: 1 } ]);
  });

  it('orders files alphabetically, whatever order Stryker emitted them in', () => {
    const report = {
      files: {
        'src/z.ts': { mutants: [ mutant('Survived'), mutant('NoCoverage') ] },
        'src/a.ts': { mutants: [ mutant('Survived'), mutant('NoCoverage') ] },
      },
    };

    expect(collectFindings(report).survivors.map((entry) => entry.file)).toEqual([ 'src/a.ts', 'src/z.ts' ]);
    expect(collectFindings(report).noCoverage.map((entry) => entry.file)).toEqual([ 'src/a.ts', 'src/z.ts' ]);
  });

  it('lists a file only under the finding it actually has', () => {
    const report = {
      files: {
        'src/survivor.ts': { mutants: [ mutant('Survived') ] },
        'src/uncovered.ts': { mutants: [ mutant('NoCoverage') ] },
      },
    };

    expect(collectFindings(report).survivors.map((entry) => entry.file)).toEqual([ 'src/survivor.ts' ]);
    expect(collectFindings(report).noCoverage.map((entry) => entry.file)).toEqual([ 'src/uncovered.ts' ]);
  });
});

describe('isFailingRun', () => {
  it('fails a run that left a survivor', () => {
    expect(isFailingRun(collectFindings(reportOf([ 'Killed', 'Survived' ])))).toBe(true);
  });

  it('passes a run whose only finding is a mutant no test covered, which the CRAP gate owns', () => {
    expect(isFailingRun(collectFindings(reportOf([ 'Killed', 'NoCoverage' ])))).toBe(false);
  });

  it('passes a run that killed everything', () => {
    expect(isFailingRun(collectFindings(reportOf([ 'Killed', 'Timeout' ])))).toBe(false);
  });

  it('passes a run that mutated nothing', () => {
    expect(isFailingRun(collectFindings({ files: {} }))).toBe(false);
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
