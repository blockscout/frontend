import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';

import { getChangedFiles, resolveBaseCommit } from '../../code-complexity/select/diff';
import { DEFAULT_BASE_BRANCH } from '../config';

// What a run screens, resolved once up front. Anything the caller passed explicitly (`--base`,
// `--spec`, `--ticket`) is taken verbatim; only the gaps are derived from git and the task folder,
// so the review that already pinned a base never sees a different one here.

export type Scope = 'branch' | 'uncommitted';

export interface ChangeRequest {
  readonly scope: Scope;
  readonly base: string | undefined;
  readonly spec: string | undefined;
  readonly ticket: string | undefined;
}

export interface TouchedFile {
  readonly path: string;
  readonly untracked: boolean;
}

export interface Change {
  readonly scope: Scope;
  readonly base: string;
  readonly branch: string;
  readonly files: ReadonlyArray<TouchedFile>;
  readonly spec: string | undefined;
  readonly ticket: string | undefined;
}

const TASKS_DIR = '.agents/tasks';
const ISSUE_BRANCH = /^issue-(\d+)$/;
const UNCHECKED_TICKET = /^- \[ \] (\d+)\b/m;

function git(args: ReadonlyArray<string>, cwd: string): string {
  return execFileSync('git', args as Array<string>, { cwd, encoding: 'utf8' });
}

// A detached HEAD has no branch name; 'detached' keeps the sidecar name well-formed.
export function currentBranch(cwd: string): string {
  return git([ 'branch', '--show-current' ], cwd).trim() || 'detached';
}

export function resolveBase(scope: Scope, explicit: string | undefined, cwd: string): string {
  if (explicit !== undefined) return explicit;
  return scope === 'branch' ? resolveBaseCommit(DEFAULT_BASE_BRANCH, cwd) : 'HEAD';
}

function listUntracked(cwd: string): Array<string> {
  return git([ 'ls-files', '--others', '--exclude-standard' ], cwd).split('\n').map((line) => line.trim()).filter(Boolean);
}

// Both scopes diff against the working tree, so uncommitted edits count under either; a file the
// change deleted is dropped because there is nothing left to score.
export function listTouchedFiles(base: string, cwd: string): Array<TouchedFile> {
  const untracked = new Set(listUntracked(cwd));
  const tracked = getChangedFiles(base, cwd).filter((file) => !untracked.has(file));
  return [ ...tracked.map((file) => ({ path: file, untracked: false })), ...[ ...untracked ].map((file) => ({ path: file, untracked: true })) ]
    .filter((file) => fs.existsSync(path.resolve(cwd, file.path)))
    .sort((a, b) => (a.path < b.path ? -1 : 1));
}

export function resolveTaskFolder(branch: string, cwd: string): string | undefined {
  const match = ISSUE_BRANCH.exec(branch);
  if (!match) return undefined;
  const tasksDir = path.resolve(cwd, TASKS_DIR);
  if (!fs.existsSync(tasksDir)) return undefined;
  const folder = fs.readdirSync(tasksDir).find((name) => name.startsWith(`${ match[1] }-`));
  return folder === undefined ? undefined : path.join(TASKS_DIR, folder);
}

export function resolveSpecPath(explicit: string | undefined, taskFolder: string | undefined, cwd: string): string | undefined {
  if (explicit !== undefined) return explicit;
  if (taskFolder === undefined) return undefined;
  const specPath = path.join(taskFolder, 'spec.md');
  return fs.existsSync(path.resolve(cwd, specPath)) ? specPath : undefined;
}

// Uncommitted work is by definition the ticket in flight — the first unchecked box in `progress.md`,
// the same reading `review-changes` makes. A `branch` run spans every ticket and names none.
export function resolveTicket(scope: Scope, explicit: string | undefined, taskFolder: string | undefined, cwd: string): string | undefined {
  if (explicit !== undefined) return explicit;
  if (scope !== 'uncommitted' || taskFolder === undefined) return undefined;
  const progressPath = path.resolve(cwd, taskFolder, 'progress.md');
  if (!fs.existsSync(progressPath)) return undefined;
  return UNCHECKED_TICKET.exec(fs.readFileSync(progressPath, 'utf8'))?.[1];
}

export function resolveChange(request: ChangeRequest, cwd: string): Change {
  const branch = currentBranch(cwd);
  const base = resolveBase(request.scope, request.base, cwd);
  const taskFolder = resolveTaskFolder(branch, cwd);
  return {
    scope: request.scope,
    base,
    branch,
    files: listTouchedFiles(base, cwd),
    spec: resolveSpecPath(request.spec, taskFolder, cwd),
    ticket: resolveTicket(request.scope, request.ticket, taskFolder, cwd),
  };
}
