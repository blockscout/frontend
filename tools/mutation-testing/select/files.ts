import fs from 'fs';
import path from 'path';

import type { LineRange } from '../../code-complexity/select/diff';
import { getAllSourceFiles, getChangedFiles, getChangedLineRanges, resolveBaseCommit } from '../../code-complexity/select/diff';
import { hasCoLocatedSpec } from '../../code-complexity/select/eligibility';
import { isInScope } from '../../code-complexity/select/scope';
import { computeMutationRanges } from './ranges';

// Which files a run mutates, and which of their lines. Three modes mirror the complexity gate's: the
// full eligible set when invoked bare, the given paths when invoked with some, and the diff against a
// base ref under --changed. Eligibility is the same rule in all three — a file is mutated only when a
// vitest spec sits beside it, so an untested file yields no findings instead of a run of unkillable
// mutants. ./ranges.ts then narrows each file to the lines worth mutating.

export interface SelectionRequest {
  readonly focusPaths: ReadonlyArray<string>;
  readonly diffSelected: boolean;
  readonly baseRef: string;
}

export interface MutateTarget {
  readonly file: string;
  readonly ranges: ReadonlyArray<LineRange>;
}

export type Selection =
  // `ineligible` carries only files the user named explicitly: in the other two modes the untested
  // files are the bulk of the repo, and listing them would bury the report.
  { readonly outcome: 'selected'; readonly targets: ReadonlyArray<MutateTarget>; readonly ineligible: ReadonlyArray<string> } |
  // Nothing to mutate. `reason` is the one line the CLI prints before exiting 0 without ever
  // starting Stryker.
  { readonly outcome: 'empty'; readonly reason: string };

const NOTHING_OUTSIDE_RENDER_BODIES = 'Every eligible file has all of its logic inside a jsx render body — nothing to mutate.';

function normalizePath(filePath: string): string {
  return filePath.replace(/\\/g, '/').replace(/^\.\//, '');
}

// Every path a selection reports stays relative to the repo, because that is the form Stryker's
// --mutate patterns take; only the filesystem lookups are resolved against `cwd`.
function isEligible(cwd: string, file: string): boolean {
  return hasCoLocatedSpec(path.resolve(cwd, file));
}

// A file with no mutable line left is dropped from the selection rather than carried into it with an
// empty range list, so the file count the run reports is the count Stryker was actually given.
function toTarget(cwd: string, file: string, changedRanges: ReadonlyArray<LineRange> | undefined): MutateTarget | undefined {
  const ranges = computeMutationRanges(fs.readFileSync(path.resolve(cwd, file), 'utf8'), file, changedRanges);
  return ranges.length === 0 ? undefined : { file, ranges };
}

function isTarget(target: MutateTarget | undefined): target is MutateTarget {
  return target !== undefined;
}

function toWholeFileTargets(cwd: string, files: ReadonlyArray<string>): Array<MutateTarget> {
  return files.map((file) => toTarget(cwd, file, undefined)).filter(isTarget);
}

// Full mode: every in-scope file in the repo that has a spec beside it.
function selectAll(cwd: string): Selection {
  const eligible = getAllSourceFiles(cwd).filter((file) => isEligible(cwd, file));
  if (eligible.length === 0) return { outcome: 'empty', reason: 'No source file in scope has a co-located vitest spec — nothing to mutate.' };

  const targets = toWholeFileTargets(cwd, eligible);
  if (targets.length === 0) return { outcome: 'empty', reason: NOTHING_OUTSIDE_RENDER_BODIES };
  return { outcome: 'selected', targets, ineligible: [] };
}

// Focused mode: the given paths, no diff-scoping. A path that does not exist is a typo worth failing
// on; one that exists but has no spec is reported as ineligible rather than silently dropped, so
// "no findings" never has to mean "your file was never mutated".
function selectFocused(cwd: string, focusPaths: ReadonlyArray<string>): Selection {
  const paths = focusPaths.map(normalizePath);
  const missing = paths.filter((filePath) => !fs.existsSync(path.resolve(cwd, filePath)));
  if (missing.length > 0) throw new Error(`No such file: ${ missing.join(', ') }`);

  const eligible = paths.filter((filePath) => isEligible(cwd, filePath));
  const ineligible = paths.filter((filePath) => !isEligible(cwd, filePath));
  if (eligible.length === 0) return { outcome: 'empty', reason: 'No given file has a co-located vitest spec — nothing to mutate.' };

  const targets = toWholeFileTargets(cwd, eligible);
  if (targets.length === 0) return { outcome: 'empty', reason: NOTHING_OUTSIDE_RENDER_BODIES };
  return { outcome: 'selected', targets, ineligible };
}

// Diff mode: the in-scope files the branch touched, resolved through the merge-base so the selection
// carries the branch's own commits plus uncommitted edits and never base-branch churn. Deleted files
// are dropped — they are in the diff, but there is nothing left to mutate. Each file is narrowed to
// the lines the diff added or modified, so a one-line fix does not pay for the whole file.
function selectChanged(cwd: string, baseRef: string): Selection {
  const baseCommit = resolveBaseCommit(baseRef, cwd);
  const changed = getChangedFiles(baseCommit, cwd).filter(isInScope).filter((file) => fs.existsSync(path.resolve(cwd, file)));
  if (changed.length === 0) return { outcome: 'empty', reason: `No source file in scope changed vs ${ baseRef } — nothing to mutate.` };

  const eligible = changed.filter((file) => isEligible(cwd, file));
  if (eligible.length === 0) return { outcome: 'empty', reason: `No file changed vs ${ baseRef } has a co-located vitest spec — nothing to mutate.` };

  const targets = eligible.map((file) => toTarget(cwd, file, getChangedLineRanges(baseCommit, file, cwd))).filter(isTarget);
  if (targets.length === 0) return { outcome: 'empty', reason: `No line changed vs ${ baseRef } falls outside a jsx render body — nothing to mutate.` };
  return { outcome: 'selected', targets, ineligible: [] };
}

// `cwd` is the repository to resolve the selection in, passed rather than read off the process:
// ./files.spec.ts points it at a throwaway repo, and process.chdir() throws in the worker threads
// Stryker runs vitest in — which this tool's own specs have to survive.
export function selectFiles(request: SelectionRequest, cwd: string): Selection {
  if (request.focusPaths.length > 0) return selectFocused(cwd, request.focusPaths);
  if (request.diffSelected) return selectChanged(cwd, request.baseRef);
  return selectAll(cwd);
}
