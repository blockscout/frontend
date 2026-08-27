import { execFileSync } from 'child_process';

// Diff-scoping (spec FR5): map git-diff hunks against a base ref to the new-side line ranges a
// change added or modified, so the gate can select the functions those lines fall within. No
// baseline artifact is kept.

export type LineRange = [ start: number, end: number ];

function git(args: ReadonlyArray<string>): string {
  return execFileSync('git', args as Array<string>, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

// Compare against the merge-base of the branch and the base ref rather than the base ref tip:
// this captures the branch's own commits plus any uncommitted working-tree edits, and never
// reports files that only changed on the base branch since the fork point.
export function resolveBaseCommit(baseRef: string): string {
  return git([ 'merge-base', baseRef, 'HEAD' ]).trim();
}

export function getChangedFiles(baseCommit: string): Array<string> {
  const out = git([ 'diff', '--name-only', baseCommit, '--' ]);
  return out.split('\n').map((line) => line.trim()).filter(Boolean);
}

// All tracked .ts/.tsx files under src/, for full-repo mode. Scope filtering (specs, generated
// files, toolkit build output) is applied by the caller via isInScope.
export function getAllSourceFiles(): Array<string> {
  const out = git([ 'ls-files', 'src/*.ts', 'src/*.tsx', 'src/**/*.ts', 'src/**/*.tsx' ]);
  return out.split('\n').map((line) => line.trim()).filter(Boolean);
}

export function getChangedLineRanges(baseCommit: string, file: string): Array<LineRange> {
  const out = git([ 'diff', '--unified=0', '--no-color', baseCommit, '--', file ]);
  return parseHunkNewRanges(out);
}

const HUNK_HEADER = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/;

// Parse the new-side ('+') line ranges out of a `git diff --unified=0` body. A hunk header
// `@@ -a,b +c,d @@` means d lines starting at line c on the new side; d omitted means 1, and
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
