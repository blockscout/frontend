import { matchesGlob } from 'path';

import type { Questions, SystemOneResult, TypeSafeClient, Usage } from '@typesafe-ai/sdk';
import { choice, noul, TypeSafeError } from '@typesafe-ai/sdk';

import type { Rule } from '../rubric';
import type { FileWindows, Window } from '../select/hunks';
import { parseLineId } from '../select/hunks';

// The standards grid: every rubric rule × every touched file its glob matches. One request per
// window carries all of the file's rules as named `noul` questions; a cell over its threshold gets a
// second, `choice` request over the window's changed line ids to name the line. The model returns
// probabilities only — this module sets no severity and writes no claim.

export type ScreenClient = Pick<TypeSafeClient, 'systemOne'>;

export interface StandardsConfig {
  readonly model: string;
  readonly defaultThreshold: number;
  readonly thresholdOverrides: Readonly<Record<string, number>>;
  readonly maxSuspects: number;
  readonly concurrency: number;
}

export interface Cell {
  readonly rule: string;
  readonly file: string;
  readonly window: number;
  readonly score: number;
}

export interface Suspect {
  readonly rule: string;
  readonly file: string;
  readonly line: number;
  readonly score: number;
}

export interface CallRecord {
  readonly kind: 'noul' | 'choice';
  readonly file: string;
  readonly window: number;
  readonly ms: number;
  readonly usage: Usage;
}

export interface StandardsResult {
  readonly cells: ReadonlyArray<Cell>;
  readonly suspects: ReadonlyArray<Suspect>;
  readonly cut: number;
  readonly calls: ReadonlyArray<CallRecord>;
  readonly model: string | undefined;
  // The SDK error that stopped the run, after its own retries; the cells scored before it stay.
  readonly failure: string | undefined;
}

interface Candidate extends Cell {
  readonly windowRef: Window;
}

interface Located extends Suspect {
  readonly window: number;
}

export function thresholdFor(rule: string, config: StandardsConfig): number {
  return config.thresholdOverrides[rule] ?? config.defaultThreshold;
}

export function rulesFor(file: string, rules: ReadonlyArray<Rule>): Array<Rule> {
  return rules.filter((rule) => matchesGlob(file, rule.glob));
}

// Highest score first; ties keep grid order so a rerun ranks the same way.
export function selectSuspects<T extends Suspect>(candidates: ReadonlyArray<T>, maxSuspects: number): { readonly suspects: Array<T>; readonly cut: number } {
  const ranked = [ ...candidates ].sort((a, b) => b.score - a.score);
  return { suspects: ranked.slice(0, maxSuspects), cut: Math.max(0, ranked.length - maxSuspects) };
}

// A bounded worker pool. Once one task fails nothing new starts, but the tasks already in flight
// finish and record their cells; the first failure is what the caller reports.
async function runPool(tasks: ReadonlyArray<() => Promise<void>>, concurrency: number): Promise<TypeSafeError | undefined> {
  let next = 0;
  let failure: TypeSafeError | undefined;
  async function worker(): Promise<void> {
    while (next < tasks.length && failure === undefined) {
      const task = tasks[next];
      next += 1;
      try {
        await task();
      } catch (error) {
        if (!(error instanceof TypeSafeError)) throw error;
        failure ??= error;
      }
    }
  }
  await Promise.all(Array.from({ length: Math.max(1, concurrency) }, worker));
  return failure;
}

function stateOf(file: string, window: Window): { readonly file: string; readonly changes: string } {
  return { file, changes: window.state };
}

class Recorder {
  readonly cells: Array<Cell> = [];
  readonly calls: Array<CallRecord> = [];
  model: string | undefined = undefined;

  async timed<TQuestions extends Questions>(
    kind: CallRecord['kind'],
    file: string,
    window: number,
    call: () => Promise<SystemOneResult<TQuestions>>,
  ): Promise<SystemOneResult<TQuestions>> {
    const started = performance.now();
    const result = await call();
    this.calls.push({ kind, file, window, ms: Math.round(performance.now() - started), usage: result.usage });
    this.model ??= result.model;
    return result;
  }
}

interface ScreenContext {
  readonly client: ScreenClient;
  readonly config: StandardsConfig;
  readonly recorder: Recorder;
}

function scoreWindowTask(target: FileWindows, window: Window, rules: ReadonlyArray<Rule>, context: ScreenContext): () => Promise<void> {
  return async() => {
    const { client, config, recorder } = context;
    const questions = Object.fromEntries(rules.map((rule) => [ rule.id, noul(rule.question, { 'true': rule.examples, 'false': rule.not_for }) ]));
    const result = await recorder.timed('noul', target.file, window.index, () => client.systemOne({
      state: stateOf(target.file, window),
      questions,
      model: config.model,
    }));
    for (const rule of rules) {
      recorder.cells.push({ rule: rule.id, file: target.file, window: window.index, score: result.answers[rule.id].noul });
    }
  };
}

// Per rule × file, the window with the highest score is the cell; the others are kept in `cells`
// for the sidecar but never become suspects on their own.
function bestCells(cells: ReadonlyArray<Cell>, files: ReadonlyArray<FileWindows>): Array<Candidate> {
  const best = new Map<string, Candidate>();
  const windowsByFile = new Map(files.map((target) => [ target.file, target.windows ] as const));
  for (const cell of cells) {
    const key = `${ cell.rule }\0${ cell.file }`;
    const current = best.get(key);
    if (current !== undefined && current.score >= cell.score) continue;
    const windowRef = windowsByFile.get(cell.file)?.[cell.window];
    if (windowRef !== undefined) best.set(key, { ...cell, windowRef });
  }
  return [ ...best.values() ];
}

function locateTask(candidate: Candidate, rule: Rule, context: ScreenContext, located: Array<Located>): () => Promise<void> {
  return async() => {
    const { client, config, recorder } = context;
    const { windowRef, ...cell } = candidate;
    if (windowRef.changedIds.length === 0) {
      located.push({ rule: cell.rule, file: cell.file, line: windowRef.firstLine, score: cell.score, window: cell.window });
      return;
    }
    const question = { question: `Which changed line is where this holds: ${ rule.question }`, examples: rule.examples };
    const options = Object.fromEntries(windowRef.changedIds.map((id) => [ id, null ]));
    const result = await recorder.timed('choice', cell.file, cell.window, () => client.systemOne({
      state: stateOf(cell.file, windowRef),
      questions: { line: choice(question, options) },
      model: config.model,
    }));
    const line = parseLineId(result.answers.line.choice) ?? windowRef.firstLine;
    located.push({ rule: cell.rule, file: cell.file, line, score: cell.score, window: cell.window });
  };
}

export async function screenStandards(
  files: ReadonlyArray<FileWindows>,
  rules: ReadonlyArray<Rule>,
  client: ScreenClient,
  config: StandardsConfig,
): Promise<StandardsResult> {
  const recorder = new Recorder();
  const context: ScreenContext = { client, config, recorder };
  const rulesByFile = new Map(files.map((target) => [ target.file, rulesFor(target.file, rules) ] as const));

  const scoreTasks = files.flatMap((target) => {
    const fileRules = rulesByFile.get(target.file) ?? [];
    if (fileRules.length === 0) return [];
    return target.windows.map((window) => scoreWindowTask(target, window, fileRules, context));
  });
  const scoreFailure = await runPool(scoreTasks, config.concurrency);

  const located: Array<Located> = [];
  const overThreshold = bestCells(recorder.cells, files).filter((candidate) => candidate.score >= thresholdFor(candidate.rule, config));
  const ruleById = new Map(rules.map((rule) => [ rule.id, rule ] as const));
  const locateTasks = scoreFailure === undefined ?
    overThreshold.map((candidate) => locateTask(candidate, ruleById.get(candidate.rule) as Rule, context, located)) :
    [];
  const locateFailure = await runPool(locateTasks, config.concurrency);

  const { suspects, cut } = selectSuspects(located, config.maxSuspects);
  const failure = scoreFailure ?? locateFailure;
  return {
    cells: recorder.cells,
    suspects: suspects.map(({ window: _window, ...suspect }) => suspect),
    cut,
    calls: recorder.calls,
    model: recorder.model,
    failure: failure === undefined ? undefined : `${ failure.name }: ${ failure.message }`,
  };
}
