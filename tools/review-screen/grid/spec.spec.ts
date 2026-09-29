import { TypeSafeClient } from '@typesafe-ai/sdk';

import { describe, expect, it } from 'vitest';

import type { FileWindows, Window } from '../select/hunks';
import type { Requirement } from '../select/spec';
import type { SpecConfig } from './spec';
import { bestByRequirement, NO_LINE, screenSpec, selectSpecSuspects, shareCap, specGridFiles, splitCap } from './spec';

// As in standards.spec.ts, the SDK runs for real down to `fetch`; the fake scores a requirement by
// its id and the changes text so one file can cover a requirement better than another.

interface RequestBody {
  readonly model: string;
  readonly state: { readonly file: string; readonly changes: string };
  readonly questions: Record<string, { readonly type: 'noul'; readonly instructions: string; readonly criteria: Record<string, unknown> }>;
}

const USAGE = { input_tokens: 300, output_tokens: 20 };
const REPORTED_MODEL = 'jev-1.13.0-fake';

type Score = (requirement: string, file: string, changes: string) => number;

type Fail = (body: RequestBody) => Response | undefined;

function fakeClient(score: Score = () => 0, fail: Fail = () => undefined): { readonly client: TypeSafeClient; readonly requests: Array<RequestBody> } {
  const requests: Array<RequestBody> = [];
  const client = new TypeSafeClient({
    apiKey: 'test',
    logLevel: 'off',
    retry: { maxRetries: 0 },
    fetch: async(_url, init) => {
      const body = JSON.parse(String(init?.body)) as RequestBody;
      requests.push(body);
      const failure = fail(body);
      if (failure !== undefined) return failure;
      const answers = Object.fromEntries(Object.keys(body.questions).map((name) => [
        name,
        { type: 'noul', noul: score(name, body.state.file, body.state.changes) },
      ]));
      return Response.json({ model: REPORTED_MODEL, answers, usage: USAGE });
    },
  });
  return { client, requests };
}

function requirement(n: number): Requirement {
  return { id: `FR${ n }`, text: `Requirement number ${ n }.` };
}

function window(index: number, state: string = `window ${ index }`): Window {
  return { index, state, changedIds: [ 'L1' ], firstLine: 1, lastLine: 1 };
}

function target(file: string, ...windows: Array<Window>): FileWindows {
  return { file, windows };
}

const CONFIG: SpecConfig = { model: 'jev-1.13.0', threshold: 0.3, maxSuspects: 10, concurrency: 2 };
const REQUIREMENTS = [ requirement(1), requirement(2), requirement(3) ];

describe('specGridFiles', () => {
  it('drops the files under the excluded glob and keeps the rest', () => {
    const files = [
      target('.agents/tasks/1-x/spec.md', window(0)),
      target('.agents/tasks/1-x/tickets/01-a/spec.md', window(0)),
      target('src/a.ts', window(0)),
    ];
    expect(specGridFiles(files, '.agents/tasks/**').map((file) => file.file)).toEqual([ 'src/a.ts' ]);
  });
});

describe('bestByRequirement', () => {
  it('keeps the highest-scoring cell per requirement, the first in grid order on a tie whatever order they arrived in', () => {
    const cells = [
      { requirement: 'FR2', file: 'a', window: 1, score: 0.5 },
      { requirement: 'FR1', file: 'c', window: 0, score: 0.9 },
      { requirement: 'FR1', file: 'b', window: 0, score: 0.9 },
      { requirement: 'FR1', file: 'a', window: 0, score: 0.2 },
    ];
    expect(bestByRequirement(cells)).toEqual([ cells[2], cells[0] ]);
  });

  it('breaks a tie within one file on the lowest window', () => {
    const cells = [
      { requirement: 'FR1', file: 'a', window: 2, score: 0.5 },
      { requirement: 'FR1', file: 'a', window: 0, score: 0.5 },
      { requirement: 'FR1', file: 'a', window: 1, score: 0.5 },
    ];
    expect(bestByRequirement(cells)).toEqual([ cells[1] ]);
  });
});

describe('selectSpecSuspects', () => {
  it('takes the requirements under the threshold, least covered first, capped with a cut count', () => {
    const best = [
      { requirement: 'FR1', file: 'a', window: 0, score: 0.25 },
      { requirement: 'FR2', file: 'b', window: 0, score: 0.9 },
      { requirement: 'FR3', file: 'c', window: 0, score: 0.05 },
      { requirement: 'FR4', file: 'd', window: 0, score: 0.3 },
      { requirement: 'FR5', file: 'e', window: 0, score: 0.1 },
    ];
    expect(selectSpecSuspects(best, 0.3, 2)).toEqual({
      suspects: [
        { requirement: 'FR3', file: 'c', line: NO_LINE, score: 0.05 },
        { requirement: 'FR5', file: 'e', line: NO_LINE, score: 0.1 },
      ],
      cut: 1,
    });
  });
});

describe('splitCap', () => {
  it('keeps both whole while they fit together', () => {
    expect(splitCap(5, 7, 12)).toEqual({ standards: 5, spec: 7 });
    expect(splitCap(2, 3, 12)).toEqual({ standards: 2, spec: 3 });
  });

  it('gives a grid within its half the room the other does not need', () => {
    expect(splitCap(2, 20, 12)).toEqual({ standards: 2, spec: 10 });
    expect(splitCap(20, 4, 12)).toEqual({ standards: 8, spec: 4 });
  });

  it('splits evenly when both overflow, the standards grid taking the odd slot', () => {
    expect(splitCap(20, 20, 12)).toEqual({ standards: 6, spec: 6 });
    expect(splitCap(20, 20, 11)).toEqual({ standards: 6, spec: 5 });
  });
});

describe('shareCap', () => {
  it('trims two ranked lists to the split and counts the cut from each grid total', () => {
    const standards = { suspects: [ 's1', 's2', 's3', 's4' ], cut: 4 };
    const spec = { suspects: [ 'r1', 'r2', 'r3', 'r4' ], cut: 0 };
    expect(shareCap(standards, spec, 4)).toEqual({
      standards: { suspects: [ 's1', 's2' ], cut: 6 },
      spec: { suspects: [ 'r1', 'r2' ], cut: 2 },
    });
  });

  it('counts a cut the grid already made into that grid\'s total', () => {
    const standards = { suspects: [ 's1' ], cut: 0 };
    const spec = { suspects: [ 'r1', 'r2', 'r3', 'r4' ], cut: 2 };
    expect(shareCap(standards, spec, 4)).toEqual({
      standards: { suspects: [ 's1' ], cut: 0 },
      spec: { suspects: [ 'r1', 'r2', 'r3' ], cut: 3 },
    });
  });

  it('changes nothing while the two fit', () => {
    const standards = { suspects: [ 's1' ], cut: 0 };
    const spec = { suspects: [ 'r1', 'r2' ], cut: 0 };
    expect(shareCap(standards, spec, 4)).toEqual({ standards, spec });
  });
});

describe('screenSpec', () => {
  it('asks every requirement of every file window in one request each, phrased so high means addressed', async() => {
    const { client, requests } = fakeClient();
    const files = [ target('src/a.ts', window(0), window(1)), target('docs/b.md', window(0)) ];

    const result = await screenSpec(files, REQUIREMENTS, client, CONFIG);

    expect(requests).toHaveLength(3);
    expect(requests.map((request) => request.model)).toEqual([ 'jev-1.13.0', 'jev-1.13.0', 'jev-1.13.0' ]);
    expect(requests.map((request) => request.state.file).sort()).toEqual([ 'docs/b.md', 'src/a.ts', 'src/a.ts' ]);
    expect(Object.keys(requests[0].questions)).toEqual([ 'FR1', 'FR2', 'FR3' ]);
    expect(requests[0].questions.FR2.instructions).toBe('Do the changes in this file implement or contribute to the requirement: Requirement number 2.');
    expect(result.cells).toHaveLength(9);
    expect(result.model).toBe(REPORTED_MODEL);
    expect(result.calls.map((call) => call.kind)).toEqual([ 'noul', 'noul', 'noul' ]);
    expect(result.failure).toBeUndefined();
  });

  it('scores a requirement by its max over files and windows and names the best file on a suspect', async() => {
    const { client } = fakeClient((id, file, changes) => {
      if (id === 'FR1') return file === 'src/b.ts' ? 0.8 : 0.1;
      if (id === 'FR2') return changes === 'window 1' ? 0.2 : 0.05;
      return 0.9;
    });
    const files = [ target('src/a.ts', window(0), window(1)), target('src/b.ts', window(0)) ];

    const result = await screenSpec(files, REQUIREMENTS, client, CONFIG);

    expect(result.suspects).toEqual([ { requirement: 'FR2', file: 'src/a.ts', line: NO_LINE, score: 0.2 } ]);
    expect(result.cells).toEqual(expect.arrayContaining([
      { requirement: 'FR1', file: 'src/a.ts', window: 0, score: 0.1 },
      { requirement: 'FR1', file: 'src/b.ts', window: 0, score: 0.8 },
      { requirement: 'FR2', file: 'src/a.ts', window: 1, score: 0.2 },
    ]));
  });

  it('ranks suspects lowest score first and caps them', async() => {
    const scores: Record<string, number> = { FR1: 0.2, FR2: 0.01, FR3: 0.1 };
    const { client } = fakeClient((id) => scores[id]);
    const result = await screenSpec([ target('src/a.ts', window(0)) ], REQUIREMENTS, client, { ...CONFIG, maxSuspects: 2 });
    expect(result.suspects.map((suspect) => suspect.requirement)).toEqual([ 'FR2', 'FR3' ]);
    expect(result.cut).toBe(1);
  });

  it('sends nothing without requirements or without files', async() => {
    const { client, requests } = fakeClient();
    const expected = { cells: [], suspects: [], cut: 0, calls: [], model: undefined, failure: undefined };
    expect(await screenSpec([ target('src/a.ts', window(0)) ], [], client, CONFIG)).toEqual(expected);
    expect(await screenSpec([], REQUIREMENTS, client, CONFIG)).toEqual(expected);
    expect(requests).toEqual([]);
  });

  it('reports an API error as the failure, keeps the cells scored before it and names no suspects', async() => {
    const { client } = fakeClient(() => 0.01, (body) => (body.state.file === 'src/b.ts' ? Response.json({ error: 'boom' }, { status: 500 }) : undefined));
    const files = [ target('src/a.ts', window(0)), target('src/b.ts', window(0)) ];
    const result = await screenSpec(files, REQUIREMENTS, client, { ...CONFIG, concurrency: 1 });
    expect(result.failure).toMatch(/^InternalServerError: /);
    expect(result.cells.map((cell) => cell.file)).toEqual([ 'src/a.ts', 'src/a.ts', 'src/a.ts' ]);
    expect(result.suspects).toEqual([]);
  });
});
