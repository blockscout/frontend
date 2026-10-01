import { execFileSync } from 'node:child_process';

import { EXEC_MAX_BUFFER } from '../cli/exec';
import type { Commit } from './release-prs';

export function git(args: ReadonlyArray<string>, cwd: string = process.cwd()): string {
  return execFileSync('git', args as Array<string>, { cwd, encoding: 'utf8', maxBuffer: EXEC_MAX_BUFFER });
}

// Resolved from this file's directory, not counted off it: the entry runs compiled from ./dist, so its
// depth below the repo root is not the source's.
export function repoRoot(): string {
  return git([ 'rev-parse', '--show-toplevel' ], __dirname).trim();
}

export function listTags(): Array<string> {
  return git([ 'tag', '--list', 'v*' ]).split('\n').filter(Boolean);
}

const FIELD_SEPARATOR = '\x1f';
const RECORD_SEPARATOR = '\x1e';

export function parseLog(log: string): Array<Commit> {
  return log
    .split(RECORD_SEPARATOR)
    .map((record) => record.replace(/^\n/, ''))
    .filter(Boolean)
    .map((record) => {
      const [ sha, message ] = record.split(FIELD_SEPARATOR);
      return { sha, message: message.trim() };
    });
}

// `from..to` is the commit set of GitHub's `compare/from...to`: what `to` has beyond the merge base.
export function listCommits(from: string, to: string): Array<Commit> {
  return parseLog(git([ 'log', '--reverse', `--format=%H${ FIELD_SEPARATOR }%B${ RECORD_SEPARATOR }`, `${ from }..${ to }` ]));
}

export function commitMessage(sha: string): string {
  return git([ 'log', '-1', '--format=%B', sha ]).trim();
}
