import fs from 'fs';

import { getAllSourceFiles, getChangedFiles, resolveBaseCommit } from '../../code-complexity/select/diff';
import { hasCoLocatedSpec } from '../../code-complexity/select/eligibility';
import { isInScope } from '../../code-complexity/select/scope';

// Which files a run mutates. Three modes mirror the complexity gate's: the full eligible set when
// invoked bare, the given paths when invoked with some, and the diff against a base ref under
// --changed. Eligibility is the same rule in all three — a file is mutated only when a vitest spec
// sits beside it, so an untested file yields no findings instead of a run of unkillable mutants.

export interface SelectionRequest {
  readonly focusPaths: ReadonlyArray<string>;
  readonly diffSelected: boolean;
  readonly baseRef: string;
}

export type Selection =
  // `ineligible` carries only files the user named explicitly: in the other two modes the untested
  // files are the bulk of the repo, and listing them would bury the report.
  { readonly outcome: 'selected'; readonly files: ReadonlyArray<string>; readonly ineligible: ReadonlyArray<string> } |
  // Nothing to mutate. `reason` is the one line the CLI prints before exiting 0 without ever
  // starting Stryker.
  { readonly outcome: 'empty'; readonly reason: string };

function normalizePath(filePath: string): string {
  return filePath.replace(/\\/g, '/').replace(/^\.\//, '');
}

// Full mode: every in-scope file in the repo that has a spec beside it.
function selectAll(): Selection {
  const files = getAllSourceFiles().filter(hasCoLocatedSpec);
  if (files.length === 0) return { outcome: 'empty', reason: 'No source file in scope has a co-located vitest spec — nothing to mutate.' };
  return { outcome: 'selected', files, ineligible: [] };
}

// Focused mode: the given paths, no diff-scoping. A path that does not exist is a typo worth failing
// on; one that exists but has no spec is reported as ineligible rather than silently dropped, so
// "no findings" never has to mean "your file was never mutated".
function selectFocused(focusPaths: ReadonlyArray<string>): Selection {
  const paths = focusPaths.map(normalizePath);
  const missing = paths.filter((filePath) => !fs.existsSync(filePath));
  if (missing.length > 0) throw new Error(`No such file: ${ missing.join(', ') }`);

  const files = paths.filter(hasCoLocatedSpec);
  const ineligible = paths.filter((filePath) => !hasCoLocatedSpec(filePath));
  if (files.length === 0) return { outcome: 'empty', reason: 'No given file has a co-located vitest spec — nothing to mutate.' };
  return { outcome: 'selected', files, ineligible };
}

// Diff mode: the in-scope files the branch touched, resolved through the merge-base so the selection
// carries the branch's own commits plus uncommitted edits and never base-branch churn. Deleted files
// are dropped — they are in the diff, but there is nothing left to mutate.
function selectChanged(baseRef: string): Selection {
  const baseCommit = resolveBaseCommit(baseRef);
  const changed = getChangedFiles(baseCommit).filter(isInScope).filter((file) => fs.existsSync(file));
  if (changed.length === 0) return { outcome: 'empty', reason: `No source file in scope changed vs ${ baseRef } — nothing to mutate.` };

  const files = changed.filter(hasCoLocatedSpec);
  if (files.length === 0) return { outcome: 'empty', reason: `No file changed vs ${ baseRef } has a co-located vitest spec — nothing to mutate.` };
  return { outcome: 'selected', files, ineligible: [] };
}

export function selectFiles(request: SelectionRequest): Selection {
  if (request.focusPaths.length > 0) return selectFocused(request.focusPaths);
  if (request.diffSelected) return selectChanged(request.baseRef);
  return selectAll();
}
