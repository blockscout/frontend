import { execFileSync } from 'child_process';
import path from 'path';

// `--git-common-dir` is the one answer that is the same from a worktree and from the main checkout;
// git may print it relative to `cwd`.
export function resolveMainCheckout(cwd: string): string {
  const commonDir = execFileSync('git', [ 'rev-parse', '--git-common-dir' ], { cwd, encoding: 'utf8' }).trim();
  return path.dirname(path.resolve(cwd, commonDir));
}

// The root of the checkout `cwd` is in: a worktree's own root, where its tracked files live.
export function resolveCheckoutRoot(cwd: string): string {
  return execFileSync('git', [ 'rev-parse', '--show-toplevel' ], { cwd, encoding: 'utf8' }).trim();
}
