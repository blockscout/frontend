import { execFileSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

import { afterEach, describe, expect, it } from 'vitest';

import type { SidecarRecord } from './sidecar';
import { resolveMainCheckout, sidecarFileName, writeSidecar } from './sidecar';

let tmp = '';

afterEach(() => {
  if (tmp) fs.rmSync(tmp, { recursive: true, force: true });
  tmp = '';
});

function git(cwd: string, ...args: Array<string>): void {
  execFileSync('git', [ '-c', 'user.email=t@t.t', '-c', 'user.name=t', ...args ], { cwd, stdio: 'ignore' });
}

const DATE = new Date('2026-09-28T23:30:00Z');

describe('sidecarFileName', () => {
  it('joins date, branch and scope, with the ticket only when there is one', () => {
    expect(sidecarFileName({ date: DATE, branch: 'issue-3720', scope: 'branch', ticket: undefined })).toBe('2026-09-28-issue-3720-branch.json');
    expect(sidecarFileName({ date: DATE, branch: 'issue-3720', scope: 'uncommitted', ticket: '02' })).toBe('2026-09-28-issue-3720-uncommitted-02.json');
  });

  it('flattens path separators in a branch name', () => {
    expect(sidecarFileName({ date: DATE, branch: 'tom/fix thing', scope: 'branch', ticket: undefined })).toBe('2026-09-28-tom-fix-thing-branch.json');
  });
});

describe('resolveMainCheckout', () => {
  it('is the main checkout from both the main checkout and one of its worktrees', () => {
    tmp = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'review-screen-sidecar-')));
    const main = path.join(tmp, 'main');
    fs.mkdirSync(main);
    git(main, 'init', '-b', 'main');
    fs.writeFileSync(path.join(main, 'a.txt'), 'a\n');
    git(main, 'add', '.');
    git(main, 'commit', '-m', 'a');
    const worktree = path.join(tmp, 'wt');
    git(main, 'worktree', 'add', '-b', 'feature', worktree);

    expect(resolveMainCheckout(main)).toBe(main);
    expect(resolveMainCheckout(worktree)).toBe(main);
  });
});

describe('writeSidecar', () => {
  it('creates the folder and writes the record as pretty JSON', () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'review-screen-sidecar-'));
    const record: SidecarRecord = {
      version: 1,
      createdAt: DATE.toISOString(),
      status: 'skipped',
      reason: 'no key',
      model: undefined,
      inputs: { scope: 'branch', base: 'abc', branch: 'issue-1', ticket: undefined, spec: undefined, files: [] },
      standards: { cells: [], suspects: [], cut: 0 },
      spec: { status: 'no-spec' },
      calls: [],
    };
    const target = path.join(tmp, '.ai', 'jev', 'x.json');
    writeSidecar(target, record);
    expect(JSON.parse(fs.readFileSync(target, 'utf8'))).toEqual({
      version: 1,
      createdAt: '2026-09-28T23:30:00.000Z',
      status: 'skipped',
      reason: 'no key',
      inputs: { scope: 'branch', base: 'abc', branch: 'issue-1', files: [] },
      standards: { cells: [], suspects: [], cut: 0 },
      spec: { status: 'no-spec' },
      calls: [],
    });
  });
});
