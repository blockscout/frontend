import { execFileSync } from 'child_process';
import path from 'path';

// `--git-common-dir` is the one answer that is the same from a worktree and from the main checkout;
// git may print it relative to `cwd`.
export function resolveMainCheckout(cwd: string): string {
  const commonDir = execFileSync('git', [ 'rev-parse', '--git-common-dir' ], { cwd, encoding: 'utf8' }).trim();
  return path.dirname(path.resolve(cwd, commonDir));
}
