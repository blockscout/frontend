import { TypeSafeClient } from '@typesafe-ai/sdk';

import { describe, expect, it } from 'vitest';

import type { Rule } from '../rubric';
import type { FileWindows, Window } from '../select/hunks';
import type { StandardsConfig } from './standards';
import { rulesFor, screenStandards, selectSuspects, thresholdFor } from './standards';

// The SDK is exercised for real down to `fetch`, which is the system boundary: the fake answers a
// request body the way the API would, and records every body it saw.

interface RequestBody {
  readonly model: string;
  readonly state: { readonly file: string; readonly changes: string };
  readonly questions: Record<string, { readonly type: 'noul' | 'choice'; readonly criteria: Record<string, unknown> }>;
}

// How the fake scores a `noul` cell: by rule id and by the changes text, so a spec can make one
// window score higher than another. A `choice` question picks the given line id.
interface FakeApi {
  readonly score: (rule: string, changes: string) => number;
  readonly pick: (options: ReadonlyArray<string>) => string;
  readonly fail: (body: RequestBody) => Response | Error | undefined;
}

const USAGE = { input_tokens: 300, output_tokens: 20 };
const REPORTED_MODEL = 'jev-1.13.0-fake';

function respond(body: RequestBody, api: FakeApi): Response {
  const answers = Object.fromEntries(Object.entries(body.questions).map(([ name, question ]) => {
    if (question.type === 'noul') return [ name, { type: 'noul', noul: api.score(name, body.state.changes) } ];
    const options = Object.keys(question.criteria);
    const choice = api.pick(options);
    const probabilities = Object.fromEntries(options.map((option) => [ option, option === choice ? 1 : 0 ]));
    return [ name, { type: 'choice', choice, confidence: 1, probabilities } ];
  }));
  return Response.json({ model: REPORTED_MODEL, answers, usage: USAGE });
}

function fakeClient(api: Partial<FakeApi>): { readonly client: TypeSafeClient; readonly requests: Array<RequestBody> } {
  const requests: Array<RequestBody> = [];
  const full: FakeApi = { score: () => 0, pick: (options) => options[0], fail: () => undefined, ...api };
  const client = new TypeSafeClient({
    apiKey: 'test',
    logLevel: 'off',
    retry: { maxRetries: 0 },
    fetch: async(_url, init) => {
      const body = JSON.parse(String(init?.body)) as RequestBody;
      requests.push(body);
      const failure = full.fail(body);
      if (failure instanceof Error) throw failure;
      return failure ?? respond(body, full);
    },
  });
  return { client, requests };
}

function rule(id: string, glob: string = '**/*.ts'): Rule {
  return { id, cites: '.agents/rules/code-quality.md', glob, question: `Does ${ id } hold?`, examples: [ `${ id } yes` ], not_for: [ `${ id } no` ] };
}

function window(index: number, changedIds: ReadonlyArray<string>, state: string = `window ${ index }`): Window {
  return { index, state, changedIds, firstLine: 10 * (index + 1) };
}

function target(file: string, ...windows: Array<Window>): FileWindows {
  return { file, windows };
}

const CONFIG: StandardsConfig = { model: 'jev-1.13.0', defaultThreshold: 0.7, thresholdOverrides: {}, maxSuspects: 10, concurrency: 2 };

const RULES = [ rule('alpha'), rule('beta'), rule('gamma-tsx', '**/*.tsx') ];

describe('rulesFor', () => {
  it('keeps the rules whose glob matches the repo-relative path', () => {
    expect(rulesFor('src/a.ts', RULES).map((r) => r.id)).toEqual([ 'alpha', 'beta' ]);
    expect(rulesFor('src/a.tsx', RULES).map((r) => r.id)).toEqual([ 'gamma-tsx' ]);
    expect(rulesFor('README.md', RULES)).toEqual([]);
  });
});

describe('thresholdFor', () => {
  it('prefers a per-rule override over the default', () => {
    const config = { ...CONFIG, thresholdOverrides: { alpha: 0.9 } };
    expect(thresholdFor('alpha', config)).toBe(0.9);
    expect(thresholdFor('beta', config)).toBe(0.7);
  });
});

describe('selectSuspects', () => {
  it('ranks by score, caps the list and counts what was cut', () => {
    const candidates = [
      { rule: 'a', file: 'f', line: 1, score: 0.71 },
      { rule: 'b', file: 'f', line: 2, score: 0.99 },
      { rule: 'c', file: 'f', line: 3, score: 0.8 },
    ];
    expect(selectSuspects(candidates, 2)).toEqual({
      suspects: [ candidates[1], candidates[2] ],
      cut: 1,
    });
    expect(selectSuspects(candidates, 5).cut).toBe(0);
  });
});

describe('screenStandards', () => {
  it('sends one request per window carrying every matching rule as a noul question on the pinned model', async() => {
    const { client, requests } = fakeClient({});
    const files = [ target('src/a.ts', window(0, [ 'L1' ]), window(1, [ 'L2' ])), target('src/b.tsx', window(0, [ 'L1' ])) ];

    const result = await screenStandards(files, RULES, client, CONFIG);

    expect(requests).toHaveLength(3);
    expect(requests.map((request) => request.model)).toEqual([ 'jev-1.13.0', 'jev-1.13.0', 'jev-1.13.0' ]);
    const forA = requests.filter((request) => request.state.file === 'src/a.ts');
    expect(forA.map((request) => request.state.changes).sort()).toEqual([ 'window 0', 'window 1' ]);
    expect(Object.keys(forA[0].questions)).toEqual([ 'alpha', 'beta' ]);
    expect(forA[0].questions.alpha).toMatchObject({ type: 'noul', criteria: { 'true': [ 'alpha yes' ], 'false': [ 'alpha no' ] } });
    expect(result.cells).toHaveLength(5);
    expect(result.suspects).toEqual([]);
    expect(result.model).toBe(REPORTED_MODEL);
    expect(result.failure).toBeUndefined();
  });

  it('skips a file no rule matches without a request', async() => {
    const { client, requests } = fakeClient({});
    const result = await screenStandards([ target('docs/x.md', window(0, [ 'L1' ])) ], RULES, client, CONFIG);
    expect(requests).toEqual([]);
    expect(result.cells).toEqual([]);
  });

  it('takes the max across windows and locates the line in the winning window with one choice call', async() => {
    const { client, requests } = fakeClient({
      score: (ruleId, changes) => (ruleId === 'alpha' && changes === 'window 1' ? 0.95 : 0.2),
      pick: () => 'L21',
    });
    const files = [ target('src/a.ts', window(0, [ 'L1', 'L2' ]), window(1, [ 'L20', 'L21', 'L22' ])) ];

    const result = await screenStandards(files, RULES, client, CONFIG);

    expect(result.suspects).toEqual([ { rule: 'alpha', file: 'src/a.ts', line: 21, score: 0.95 } ]);
    const locate = requests.filter((request) => request.questions.line?.type === 'choice');
    expect(locate).toHaveLength(1);
    expect(locate[0].state.changes).toBe('window 1');
    expect(Object.keys(locate[0].questions.line.criteria)).toEqual([ 'L20', 'L21', 'L22' ]);
    expect(result.cells).toEqual(expect.arrayContaining([
      { rule: 'alpha', file: 'src/a.ts', window: 0, score: 0.2 },
      { rule: 'alpha', file: 'src/a.ts', window: 1, score: 0.95 },
    ]));
  });

  it('applies a per-rule threshold override', async() => {
    const { client } = fakeClient({ score: () => 0.75 });
    const config = { ...CONFIG, thresholdOverrides: { alpha: 0.8 } };
    const result = await screenStandards([ target('src/a.ts', window(0, [ 'L1' ])) ], RULES, client, config);
    expect(result.suspects.map((suspect) => suspect.rule)).toEqual([ 'beta' ]);
  });

  it('falls back to the window start when a suspect window has no changed line, and to it when the model names an unknown id', async() => {
    const { client, requests } = fakeClient({ score: () => 0.9, pick: () => 'nonsense' });
    const files = [ target('src/a.ts', window(0, [])), target('src/b.ts', window(0, [ 'L1' ])) ];
    const result = await screenStandards(files, [ rule('alpha') ], client, CONFIG);
    expect(result.suspects).toEqual(expect.arrayContaining([
      { rule: 'alpha', file: 'src/a.ts', line: 10, score: 0.9 },
      { rule: 'alpha', file: 'src/b.ts', line: 10, score: 0.9 },
    ]));
    expect(requests.filter((request) => request.questions.line?.type === 'choice')).toHaveLength(1);
  });

  it('caps the suspects at maxSuspects, highest score first, and reports the cut', async() => {
    const scores: Record<string, number> = { alpha: 0.8, beta: 0.99 };
    const { client } = fakeClient({ score: (ruleId) => scores[ruleId] });
    const result = await screenStandards([ target('src/a.ts', window(0, [ 'L1' ])) ], RULES, client, { ...CONFIG, maxSuspects: 1 });
    expect(result.suspects.map((suspect) => suspect.rule)).toEqual([ 'beta' ]);
    expect(result.cut).toBe(1);
  });

  it('records a timing, the usage and the model per call', async() => {
    const { client } = fakeClient({ score: () => 0.9 });
    const result = await screenStandards([ target('src/a.ts', window(0, [ 'L1' ])) ], [ rule('alpha') ], client, CONFIG);
    expect(result.calls.map((call) => call.kind)).toEqual([ 'noul', 'choice' ]);
    expect(result.calls[0]).toMatchObject({ file: 'src/a.ts', window: 0, usage: USAGE });
    expect(result.calls[0].ms).toBeGreaterThanOrEqual(0);
    expect(result.model).toBe(REPORTED_MODEL);
  });

  it('reports an API error as the failure and keeps the cells scored before it, without locating', async() => {
    const { client, requests } = fakeClient({
      score: () => 0.9,
      fail: (body) => (body.state.file === 'src/b.ts' ? Response.json({ error: 'boom' }, { status: 500 }) : undefined),
    });
    const files = [ target('src/a.ts', window(0, [ 'L1' ])), target('src/b.ts', window(0, [ 'L1' ])) ];
    const result = await screenStandards(files, [ rule('alpha') ], client, { ...CONFIG, concurrency: 1 });
    expect(result.failure).toMatch(/^InternalServerError: /);
    expect(result.cells).toEqual([ { rule: 'alpha', file: 'src/a.ts', window: 0, score: 0.9 } ]);
    expect(result.suspects).toEqual([]);
    expect(requests.filter((request) => request.questions.line?.type === 'choice')).toEqual([]);
  });

  it('reports a connection failure the same way', async() => {
    const { client } = fakeClient({ fail: () => new TypeError('fetch failed') });
    const result = await screenStandards([ target('src/a.ts', window(0, [ 'L1' ])) ], [ rule('alpha') ], client, CONFIG);
    expect(result.failure).toMatch(/^APIConnectionError: /);
    expect(result.cells).toEqual([]);
  });
});
