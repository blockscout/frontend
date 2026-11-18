import { execFileSync } from 'child_process';

import { EXEC_MAX_BUFFER } from '../../cli/exec';
import { isInScope } from './scope';

export type LineRange = [ start: number, end: number ];

// `cwd` is passed explicitly rather than taken from the process's own directory: process.chdir() is
// unavailable in the worker threads Stryker runs vitest in.
function git(args: ReadonlyArray<string>, cwd: string): string {
  return execFileSync('git', args as Array<string>, { cwd, encoding: 'utf8', maxBuffer: EXEC_MAX_BUFFER });
}

// The merge-base of the branch and the base ref, not the base ref tip, so a diff against it never
// reports files that only changed on the base branch since the fork point.
export function resolveBaseCommit(baseRef: string, cwd: string): string {
  return git([ 'merge-base', baseRef, 'HEAD' ], cwd).trim();
}

export function getChangedFiles(baseCommit: string, cwd: string): Array<string> {
  const out = git([ 'diff', '--name-only', baseCommit, '--' ], cwd);
  return out.split('\n').map((line) => line.trim()).filter(Boolean);
}

// Tracked files narrowed through isInScope rather than a git pathspec, which would be a second copy
// of the scope rule to keep in sync.
export function getAllSourceFiles(cwd: string): Array<string> {
  const out = git([ 'ls-files' ], cwd);
  return out.split('\n').map((line) => line.trim()).filter(isInScope);
}

export function getChangedLineRanges(baseCommit: string, file: string, cwd: string): Array<LineRange> {
  const out = git([ 'diff', '--unified=0', '--no-color', baseCommit, '--', file ], cwd);
  return parseHunkNewRanges(out);
}

const HUNK_HEADER = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/;

// Takes a `git diff --unified=0` body. In a hunk header `@@ -a,b +c,d @@`, d omitted means 1, and
// d === 0 is a pure deletion that adds no new lines.
export function parseHunkNewRanges(diffText: string): Array<LineRange> {
  const ranges: Array<LineRange> = [];
  for (const line of diffText.split('\n')) {
    const match = HUNK_HEADER.exec(line);
    if (!match) continue;
    const start = Number(match[1]);
    const count = match[2] === undefined ? 1 : Number(match[2]);
    if (count === 0) continue;
    ranges.push([ start, start + count - 1 ]);
  }
  return ranges;
}

export function rangesOverlap(ranges: ReadonlyArray<LineRange>, start: number, end: number): boolean {
  return ranges.some(([ rangeStart, rangeEnd ]) => rangeStart <= end && rangeEnd >= start);
}
