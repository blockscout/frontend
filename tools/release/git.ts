import { execFileSync } from 'node:child_process';

import { EXEC_MAX_BUFFER } from '../cli/exec';

export function git(args: ReadonlyArray<string>, cwd: string = process.cwd()): string {
  return execFileSync('git', args as Array<string>, { cwd, encoding: 'utf8', maxBuffer: EXEC_MAX_BUFFER });
}

// Resolved from this file's directory, not counted off it: the entry runs compiled from ./dist, so its
// depth below the repo root is not the source's.
export function repoRoot(): string {
  return git([ 'rev-parse', '--show-toplevel' ], __dirname).trim();
}
