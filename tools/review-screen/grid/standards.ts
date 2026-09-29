import { matchesGlob } from 'path';

import { choice, noul } from '@typesafe-ai/sdk';

import type { Rule } from '../rubric';
import type { FileWindows, Window } from '../select/hunks';
import { parseLineId } from '../select/hunks';
import type { CallRecord, ScreenClient } from './shared';
import { compareText, describeFailure, Recorder, runPool, stateOf } from './shared';

// The standards grid: every rubric rule × every touched file its glob matches. One request per
// window carries all of the file's rules as named `noul` questions; a cell over its threshold gets a
// second, `choice` request over the window's changed line ids to name the line. The model returns
// probabilities only — this module sets no severity and writes no claim.

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

// `window` names the window the score came from; `--origins` matches a review finding to the suspect
// by that window's line span, which the sidecar records.
export interface Suspect {
  readonly rule: string;
  readonly file: string;
  readonly line: number;
  readonly score: number;
  readonly window: number;
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

interface ScreenContext {
  readonly client: ScreenClient;
  readonly config: StandardsConfig;
  readonly recorder: Recorder<Cell>;
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

// Cells and located suspects arrive in completion order, which the pool does not fix; grid order
// (file, window, rule) is what a tie-break and the cap must see so a rerun ranks the same way.
export function inGridOrder<T extends { readonly file: string; readonly window: number; readonly rule: string }>(items: ReadonlyArray<T>): Array<T> {
  return [ ...items ].sort((a, b) => compareText(a.file, b.file) || a.window - b.window || compareText(a.rule, b.rule));
}

// Per rule × file, the window with the highest score is the cell; the others are kept in `cells`
// for the sidecar but never become suspects on their own.
function bestCells(cells: ReadonlyArray<Cell>, files: ReadonlyArray<FileWindows>): Array<Candidate> {
  const best = new Map<string, Candidate>();
  const windowsByFile = new Map(files.map((target) => [ target.file, target.windows ] as const));
  for (const cell of inGridOrder(cells)) {
    const key = `${ cell.rule }\0${ cell.file }`;
    const current = best.get(key);
    if (current !== undefined && current.score >= cell.score) continue;
    const windowRef = windowsByFile.get(cell.file)?.[cell.window];
    // Stryker disable next-line ConditionalExpression: every cell was scored from a window of `files`, so the lookup narrows the type and never misses
    if (windowRef !== undefined) best.set(key, { ...cell, windowRef });
  }
  return [ ...best.values() ];
}

function locateTask(candidate: Candidate, rule: Rule, context: ScreenContext, located: Array<Suspect>): () => Promise<void> {
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
    const chosen = result.answers.line.choice;
    const line = (windowRef.changedIds.includes(chosen) ? parseLineId(chosen) : undefined) ?? windowRef.firstLine;
    located.push({ rule: cell.rule, file: cell.file, line, score: cell.score, window: cell.window });
  };
}

export async function screenStandards(
  files: ReadonlyArray<FileWindows>,
  rules: ReadonlyArray<Rule>,
  client: ScreenClient,
  config: StandardsConfig,
): Promise<StandardsResult> {
  const recorder = new Recorder<Cell>();
  const context: ScreenContext = { client, config, recorder };
  const rulesByFile = new Map(files.map((target) => [ target.file, rulesFor(target.file, rules) ] as const));

  const scoreTasks = files.flatMap((target) => {
    const fileRules = rulesByFile.get(target.file) ?? [];
    if (fileRules.length === 0) return [];
    return target.windows.map((window) => scoreWindowTask(target, window, fileRules, context));
  });
  const scoreFailure = await runPool(scoreTasks, config.concurrency);

  const located: Array<Suspect> = [];
  const overThreshold = bestCells(recorder.cells, files).filter((candidate) => candidate.score >= thresholdFor(candidate.rule, config));
  const ruleById = new Map(rules.map((rule) => [ rule.id, rule ] as const));
  const locateTasks = scoreFailure === undefined ?
    overThreshold.map((candidate) => locateTask(candidate, ruleById.get(candidate.rule) as Rule, context, located)) :
    [];
  const locateFailure = await runPool(locateTasks, config.concurrency);

  // A locate failure leaves the list partial, so nothing is ranked — the same as a score failure.
  const { suspects, cut } = locateFailure === undefined ? selectSuspects(inGridOrder(located), config.maxSuspects) : { suspects: [], cut: 0 };
  return {
    cells: recorder.cells,
    suspects,
    cut,
    calls: recorder.calls,
    model: recorder.model,
    failure: describeFailure(scoreFailure ?? locateFailure),
  };
}
