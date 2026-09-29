import { matchesGlob } from 'path';

import { noul } from '@typesafe-ai/sdk';

import type { FileWindows, Window } from '../select/hunks';
import type { Requirement } from '../select/spec';
import type { CallRecord, ScreenClient } from './shared';
import { compareText, describeFailure, Recorder, runPool, stateOf } from './shared';

// The spec grid: every Functional Requirement × every touched file. One request per window carries
// every requirement as a named `noul` question phrased so that a high value means "addressed"; a
// requirement's score is its max over files and windows, and it is a suspect when that max stays
// *below* the threshold — the inverse of the standards grid. That asymmetry lives here only: the
// output and the renderer see suspects and scores, never the direction of the comparison.

export interface SpecConfig {
  readonly model: string;
  readonly threshold: number;
  readonly maxSuspects: number;
  readonly concurrency: number;
}

export interface SpecCell {
  readonly requirement: string;
  readonly file: string;
  readonly window: number;
  readonly score: number;
}

export const NO_LINE = '—' as const;

export interface SpecSuspect {
  readonly requirement: string;
  readonly file: string;
  readonly line: typeof NO_LINE;
  readonly score: number;
}

export interface SpecResult {
  readonly cells: ReadonlyArray<SpecCell>;
  readonly suspects: ReadonlyArray<SpecSuspect>;
  readonly cut: number;
  readonly calls: ReadonlyArray<CallRecord>;
  readonly model: string | undefined;
  readonly failure: string | undefined;
}

export function specGridFiles(files: ReadonlyArray<FileWindows>, excludeGlob: string): Array<FileWindows> {
  return files.filter((target) => !matchesGlob(target.file, excludeGlob));
}

export function requirementQuestion(requirement: Requirement): string {
  return `Do the changes in this file implement or contribute to the requirement: ${ requirement.text }`;
}

const CRITERIA = {
  'true': 'the changed lines add, wire or test something the requirement asks for',
  'false': 'the changed lines are unrelated to the requirement, or only touch it in passing',
};

// Per requirement, the best cell over every file and window; ties keep grid order so a rerun ranks
// the same way.
export function bestByRequirement(cells: ReadonlyArray<SpecCell>): Array<SpecCell> {
  const best = new Map<string, SpecCell>();
  const ordered = [ ...cells ].sort((a, b) => compareText(a.requirement, b.requirement) || compareText(a.file, b.file) || a.window - b.window);
  for (const cell of ordered) {
    const current = best.get(cell.requirement);
    if (current === undefined || cell.score > current.score) best.set(cell.requirement, cell);
  }
  return [ ...best.values() ];
}

// Lowest score first: the least-covered requirement is the most suspect.
export function selectSpecSuspects(
  best: ReadonlyArray<SpecCell>,
  threshold: number,
  maxSuspects: number,
): { readonly suspects: Array<SpecSuspect>; readonly cut: number } {
  const ranked = best
    .filter((cell) => cell.score < threshold)
    .sort((a, b) => a.score - b.score)
    .map((cell): SpecSuspect => ({ requirement: cell.requirement, file: cell.file, line: NO_LINE, score: cell.score }));
  return { suspects: ranked.slice(0, maxSuspects), cut: Math.max(0, ranked.length - maxSuspects) };
}

// One cap for both grids. Each grid keeps everything while the two fit together; when they do not,
// a grid that stays within its half yields the rest to the other, and two overflowing grids split
// the cap evenly (the standards grid takes the odd slot).
export function splitCap(standardsTotal: number, specTotal: number, maxSuspects: number): { readonly standards: number; readonly spec: number } {
  // Stryker disable next-line EqualityOperator: when the two totals add up to the cap exactly, the branches below return the same split
  if (standardsTotal + specTotal <= maxSuspects) return { standards: standardsTotal, spec: specTotal };
  const standardsHalf = Math.ceil(maxSuspects / 2);
  const specHalf = maxSuspects - standardsHalf;
  // Stryker disable next-line EqualityOperator: a grid sitting exactly on its half gets that half either way
  if (standardsTotal <= standardsHalf) return { standards: standardsTotal, spec: maxSuspects - standardsTotal };
  // Stryker disable next-line EqualityOperator: a grid sitting exactly on its half gets that half either way
  if (specTotal <= specHalf) return { standards: maxSuspects - specTotal, spec: specTotal };
  return { standards: standardsHalf, spec: specHalf };
}

interface Capped<T> {
  readonly suspects: ReadonlyArray<T>;
  readonly cut: number;
}

// Applies `splitCap` to two already-ranked, individually-capped lists; `cut` counts from the
// grid's own total, so a suspect dropped here is reported the same way as one dropped by the grid.
export function shareCap<TStandards, TSpec>(
  standards: Capped<TStandards>,
  spec: Capped<TSpec>,
  maxSuspects: number,
): { readonly standards: Capped<TStandards>; readonly spec: Capped<TSpec> } {
  const standardsTotal = standards.suspects.length + standards.cut;
  const specTotal = spec.suspects.length + spec.cut;
  const cap = splitCap(standardsTotal, specTotal, maxSuspects);
  return {
    standards: { suspects: standards.suspects.slice(0, cap.standards), cut: standardsTotal - Math.min(cap.standards, standards.suspects.length) },
    spec: { suspects: spec.suspects.slice(0, cap.spec), cut: specTotal - Math.min(cap.spec, spec.suspects.length) },
  };
}

function scoreWindowTask(
  target: FileWindows,
  window: Window,
  requirements: ReadonlyArray<Requirement>,
  client: ScreenClient,
  config: SpecConfig,
  recorder: Recorder<SpecCell>,
): () => Promise<void> {
  return async() => {
    const questions = Object.fromEntries(requirements.map((requirement) => [ requirement.id, noul(requirementQuestion(requirement), CRITERIA) ]));
    const result = await recorder.timed('noul', target.file, window.index, () => client.systemOne({
      state: stateOf(target.file, window),
      questions,
      model: config.model,
    }));
    for (const requirement of requirements) {
      recorder.cells.push({ requirement: requirement.id, file: target.file, window: window.index, score: result.answers[requirement.id].noul });
    }
  };
}

export async function screenSpec(
  files: ReadonlyArray<FileWindows>,
  requirements: ReadonlyArray<Requirement>,
  client: ScreenClient,
  config: SpecConfig,
): Promise<SpecResult> {
  const recorder = new Recorder<SpecCell>();
  const tasks = requirements.length === 0 ?
    [] :
    files.flatMap((target) => target.windows.map((window) => scoreWindowTask(target, window, requirements, client, config, recorder)));
  const failure = await runPool(tasks, config.concurrency);
  const { suspects, cut } = failure === undefined ?
    selectSpecSuspects(bestByRequirement(recorder.cells), config.threshold, config.maxSuspects) :
    { suspects: [], cut: 0 };
  return { cells: recorder.cells, suspects, cut, calls: recorder.calls, model: recorder.model, failure: describeFailure(failure) };
}
