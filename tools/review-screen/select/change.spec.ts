import { execFileSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

import { afterEach, describe, expect, it } from 'vitest';

import type { ChangeRequest } from './change';
import { resolveChange } from './change';

// A throwaway repository, addressed by path, so the assertions do not depend on what this branch
// happens to have changed. `git init -b main` because the tool's default base branch is `main`.
let repo = '';

afterEach(() => {
  if (repo) fs.rmSync(repo, { recursive: true, force: true });
  repo = '';
});

function git(...args: Array<string>): string {
  const stdio: Array<'ignore' | 'pipe'> = [ 'ignore', 'pipe', 'ignore' ];
  return execFileSync('git', [ '-c', 'user.email=t@t.t', '-c', 'user.name=t', ...args ], { cwd: repo, encoding: 'utf8', stdio });
}

function write(filePath: string, body: string): void {
  const target = path.join(repo, filePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, body);
}

// main: src/base.ts, .agents/tasks/12-thing/{spec.md,progress.md}; then src/landed-later.ts after the fork.
// issue-12: commits src/touched.ts and deletes src/base.ts; leaves src/edited.ts modified and
// src/new.ts untracked in the working tree.
function createForkedRepo(): void {
  repo = fs.mkdtempSync(path.join(os.tmpdir(), 'review-screen-change-'));
  git('init', '-b', 'main');
  write('src/base.ts', 'export const base = 1;\n');
  write('src/edited.ts', 'export const edited = 1;\n');
  write('.agents/tasks/12-thing/spec.md', '# Spec\n');
  write('.agents/tasks/12-thing/progress.md', '- [x] 01 → `tickets/01-a/`\n- [ ] 02 → `tickets/02-b/`\n- [ ] 03 → `tickets/03-c/`\n');
  git('add', '.');
  git('commit', '-m', 'base');

  git('checkout', '-b', 'issue-12');
  write('src/touched.ts', 'export const touched = 1;\n');
  git('rm', '-q', 'src/base.ts');
  git('add', '.');
  git('commit', '-m', 'feature');

  git('checkout', 'main');
  write('src/landed-later.ts', 'export const landedLater = 1;\n');
  git('add', '.');
  git('commit', '-m', 'landed later');

  git('checkout', 'issue-12');
  write('src/edited.ts', 'export const edited = 2;\n');
  write('src/new.ts', 'export const fresh = 1;\n');
}

function resolve(overrides: Partial<ChangeRequest>): ReturnType<typeof resolveChange> {
  return resolveChange({ scope: 'branch', base: undefined, spec: undefined, ticket: undefined, ...overrides }, repo);
}

describe('resolveChange', () => {
  it('under --scope branch, diffs from the merge-base with main and lists untracked files, never base-branch churn', () => {
    createForkedRepo();
    const change = resolve({ scope: 'branch' });
    expect(change.base).toBe(git('merge-base', 'main', 'HEAD').trim());
    expect(change.files).toEqual([
      { path: 'src/edited.ts', untracked: false },
      { path: 'src/new.ts', untracked: true },
      { path: 'src/touched.ts', untracked: false },
    ]);
    expect(change.branch).toBe('issue-12');
  });

  it('under --scope uncommitted, diffs HEAD against the working tree', () => {
    createForkedRepo();
    const change = resolve({ scope: 'uncommitted' });
    expect(change.base).toBe('HEAD');
    expect(change.files).toEqual([
      { path: 'src/edited.ts', untracked: false },
      { path: 'src/new.ts', untracked: true },
    ]);
  });

  it('takes an explicit --base verbatim', () => {
    createForkedRepo();
    expect(resolve({ base: 'main' }).base).toBe('main');
    expect(resolve({ scope: 'uncommitted', base: 'main~1' }).base).toBe('main~1');
  });

  it('resolves the task spec from the issue branch, and takes an explicit --spec verbatim', () => {
    createForkedRepo();
    expect(resolve({}).spec).toBe('.agents/tasks/12-thing/spec.md');
    expect(resolve({ spec: 'elsewhere/spec.md' }).spec).toBe('elsewhere/spec.md');
  });

  it('records no spec when the branch has no task folder', () => {
    createForkedRepo();
    git('checkout', '-b', 'not-a-task');
    expect(resolve({}).spec).toBeUndefined();
    git('checkout', '-b', 'issue-99');
    expect(resolve({}).spec).toBeUndefined();
  });

  it('records no spec, without throwing, when the checkout has no tasks directory at all', () => {
    createForkedRepo();
    fs.rmSync(path.join(repo, '.agents'), { recursive: true, force: true });
    expect(resolve({}).spec).toBeUndefined();
  });

  it('infers the ticket in flight from progress.md only under --scope uncommitted', () => {
    createForkedRepo();
    expect(resolve({ scope: 'uncommitted' }).ticket).toBe('02');
    expect(resolve({ scope: 'branch' }).ticket).toBeUndefined();
    expect(resolve({ scope: 'branch', ticket: '05' }).ticket).toBe('05');
  });

  it('records no ticket, without throwing, when there is no task folder or no progress.md to read', () => {
    createForkedRepo();
    fs.rmSync(path.join(repo, '.agents/tasks/12-thing/progress.md'));
    expect(resolve({ scope: 'uncommitted' }).ticket).toBeUndefined();
    git('checkout', '-b', 'not-a-task');
    expect(resolve({ scope: 'uncommitted' }).ticket).toBeUndefined();
  });

  it('names a detached HEAD so the sidecar file name stays well-formed', () => {
    createForkedRepo();
    git('checkout', '--detach');
    expect(resolve({}).branch).toBe('detached');
  });
});
