import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import { EXEC_MAX_BUFFER } from '../cli/exec';
import type { Commit } from './release-prs';

export const REMOTE = 'origin';

interface GitOptions {
  readonly cwd?: string;
  readonly env?: typeof process.env;
  readonly input?: string;
}

export function git(args: ReadonlyArray<string>, { cwd = process.cwd(), env, input }: GitOptions = {}): string {
  return execFileSync('git', args as Array<string>, { cwd, env, input, encoding: 'utf8', maxBuffer: EXEC_MAX_BUFFER });
}

// Resolved from this file's directory, not counted off it: the entry runs compiled from ./dist, so its
// depth below the repo root is not the source's.
export function repoRoot(): string {
  return git([ 'rev-parse', '--show-toplevel' ], { cwd: __dirname }).trim();
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

export function listShas(from: string, to: string): Array<string> {
  return git([ 'rev-list', '--reverse', `${ from }..${ to }` ]).split('\n').filter(Boolean);
}

export function commitMessage(sha: string): string {
  return git([ 'log', '-1', '--format=%B', sha ]).trim();
}

// The tags come along so `previousTag` and the notes see every release, whichever branch it is on.
export function fetchBranch(branch: string): void {
  git([ 'fetch', '--quiet', '--tags', REMOTE, branch ]);
}

export function remoteBranch(branch: string): string {
  return `${ REMOTE }/${ branch }`;
}

export function resolveCommit(ref: string): string {
  return git([ 'rev-parse', '--verify', `${ ref }^{commit}` ]).trim();
}

export function mergeBase(a: string, b: string): string {
  return git([ 'merge-base', a, b ]).trim();
}

export function isAncestor(ancestor: string, descendant: string): boolean {
  try {
    git([ 'merge-base', '--is-ancestor', ancestor, descendant ]);
    return true;
  } catch {
    return false;
  }
}

export function hasLocalRef(ref: string): boolean {
  try {
    git([ 'rev-parse', '--verify', '--quiet', ref ]);
    return true;
  } catch {
    return false;
  }
}

export function hasRemoteRef(ref: string): boolean {
  return git([ 'ls-remote', REMOTE, ref ]).trim() !== '';
}

export function showFile(ref: string, filePath: string): string {
  return git([ 'show', `${ ref }:${ filePath }` ]);
}

export function hasCleanWorkingTree(): boolean {
  return git([ 'status', '--porcelain', '--untracked-files=no' ]).trim() === '';
}

export function hasCherryPickInProgress(): boolean {
  return hasLocalRef('CHERRY_PICK_HEAD');
}

export function switchBranch(branch: string): void {
  git([ 'switch', '--quiet', branch ]);
}

export function createBranchAt(branch: string, start: string): void {
  git([ 'switch', '--quiet', '--no-track', '--create', branch, start ]);
}

export function trackRemoteBranch(branch: string): void {
  git([ 'switch', '--quiet', '--track', '--create', branch, remoteBranch(branch) ]);
}

export function fastForward(ref: string): void {
  git([ 'merge', '--quiet', '--ff-only', ref ]);
}

export function cherryPick(sha: string): void {
  git([ 'cherry-pick', '-x', sha ]);
}

export function unmergedFiles(): Array<string> {
  return git([ 'diff', '--name-only', '--diff-filter=U' ]).split('\n').filter(Boolean);
}

export interface FileChange {
  readonly path: string;
  readonly content: string;
}

// Through the checkout and with explicit paths: the release branch is checked out while this runs, and
// nothing else the operator may have lying around belongs in a docs commit.
export function writeAndCommit(files: ReadonlyArray<FileChange>, message: string): string {
  const root = repoRoot();
  for (const file of files) {
    fs.writeFileSync(path.join(root, file.path), file.content);
  }
  git([ 'add', '--', ...files.map((file) => file.path) ], { cwd: root });
  git([ 'commit', '--quiet', '-m', message ], { cwd: root });
  return resolveCommit('HEAD');
}

export function createTag(tag: string, sha: string): void {
  git([ 'tag', tag, sha ]);
}

export function push(ref: string): void {
  git([ 'push', '--quiet', REMOTE, ref ]);
}

export function pushBranch(branch: string): void {
  git([ 'push', '--quiet', '--set-upstream', REMOTE, branch ]);
}
