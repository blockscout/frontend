import { describe, expect, it } from 'vitest';

import type { Mutant } from './report';
import type { StreamRecord } from './stream';
import { formatStreamRecord, parseStream } from './stream';

function mutant(id: string, status: Mutant['status'], line: number): Mutant {
  return {
    id,
    mutatorName: 'ConditionalExpression',
    status,
    location: { start: { line, column: 1 }, end: { line, column: 20 } },
  };
}

function stream(...records: ReadonlyArray<StreamRecord>): string {
  return records.map(formatStreamRecord).join('');
}

describe('parseStream', () => {
  it('reads back what the reporter wrote, keyed the way the json report keys files', () => {
    const contents = stream(
      { kind: 'plan', mutants: 2 },
      { kind: 'mutant', file: 'src/a.ts', mutant: mutant('1', 'Killed', 4) },
      { kind: 'mutant', file: 'src/a.ts', mutant: mutant('2', 'Survived', 9) },
    );

    expect(parseStream(contents)).toEqual({
      report: { files: { 'src/a.ts': { mutants: [ mutant('1', 'Killed', 4), mutant('2', 'Survived', 9) ] } } },
      tested: 2,
      planned: 2,
    });
  });

  it('groups the mutants of each file under their own entry', () => {
    const contents = stream(
      { kind: 'mutant', file: 'src/a.ts', mutant: mutant('1', 'Killed', 4) },
      { kind: 'mutant', file: 'src/b.ts', mutant: mutant('2', 'Survived', 4) },
      { kind: 'mutant', file: 'src/a.ts', mutant: mutant('3', 'NoCoverage', 7) },
    );

    const { report } = parseStream(contents);
    expect(Object.keys(report.files)).toEqual([ 'src/a.ts', 'src/b.ts' ]);
    expect(report.files['src/a.ts'].mutants.map(({ id }) => id)).toEqual([ '1', '3' ]);
  });

  // The point of the whole format: a process killed mid-write leaves a half-written last line, and
  // every complete line before it must still be readable.
  it('keeps every complete record when the last line was cut off mid-write', () => {
    const complete = stream(
      { kind: 'plan', mutants: 3 },
      { kind: 'mutant', file: 'src/a.ts', mutant: mutant('1', 'Killed', 4) },
    );
    const cutOff = `${ complete }{"kind":"mutant","file":"src/a.ts","mut`;

    expect(parseStream(cutOff)).toEqual(parseStream(complete));
  });

  it('reads an empty stream as a run that tested nothing rather than an error', () => {
    expect(parseStream('')).toEqual({ report: { files: {} }, tested: 0, planned: null });
  });

  // Stryker plans the whole run before testing anything, so a stream with no plan record was cut
  // off during the dry run: the total is unknown, and reporting it as 0 would invert the fraction.
  it('leaves the planned total unknown when no plan record arrived', () => {
    const contents = stream({ kind: 'mutant', file: 'src/a.ts', mutant: mutant('1', 'Killed', 4) });

    expect(parseStream(contents)).toMatchObject({ tested: 1, planned: null });
  });

  it('counts only mutant records as tested', () => {
    const contents = stream(
      { kind: 'plan', mutants: 9 },
      { kind: 'mutant', file: 'src/a.ts', mutant: mutant('1', 'Killed', 4) },
    );

    expect(parseStream(contents)).toMatchObject({ tested: 1, planned: 9 });
  });
});
