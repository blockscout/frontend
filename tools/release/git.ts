import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
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

export interface FileChange {
  readonly path: string;
  readonly content: string;
}

// Built on a throwaway index from the object store, so the operator's checkout and index stay as they
// are and no hook (lint-staged, LFS) runs against a tree that is not checked out.
export function commitFiles(parent: string, files: ReadonlyArray<FileChange>, message: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'release-index-'));
  // eslint-disable-next-line no-restricted-properties -- Node CLI handing its environment to git, not an app env var
  const env = { ...process.env, GIT_INDEX_FILE: path.join(dir, 'index') };
  try {
    git([ 'read-tree', parent ], { env });
    for (const file of files) {
      const blob = git([ 'hash-object', '-w', '--stdin' ], { input: file.content }).trim();
      git([ 'update-index', '--cacheinfo', `100644,${ blob },${ file.path }` ], { env });
    }
    const tree = git([ 'write-tree' ], { env }).trim();
    return git([ 'commit-tree', tree, '-p', parent, '-m', message ]).trim();
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

export function createBranch(branch: string, sha: string): void {
  git([ 'branch', '--no-track', branch, sha ]);
}

export function createTag(tag: string, sha: string): void {
  git([ 'tag', tag, sha ]);
}

export function push(ref: string): void {
  git([ 'push', REMOTE, ref ]);
}
