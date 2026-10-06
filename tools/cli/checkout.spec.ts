import { execFileSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

import { afterEach, describe, expect, it } from 'vitest';

import { resolveMainCheckout } from './checkout';

let tmp = '';

afterEach(() => {
  if (tmp) fs.rmSync(tmp, { recursive: true, force: true });
  tmp = '';
});

function git(cwd: string, ...args: Array<string>): void {
  execFileSync('git', [ '-c', 'user.email=t@t.t', '-c', 'user.name=t', ...args ], { cwd, stdio: 'ignore' });
}

describe('resolveMainCheckout', () => {
  it('is the main checkout from both the main checkout and one of its worktrees', () => {
    tmp = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'cli-checkout-')));
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
