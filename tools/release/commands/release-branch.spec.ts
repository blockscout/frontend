import { describe, expect, it } from 'vitest';

import { checkoutPlan, envDocsStepTitle, localBranchState, pickConflictMessage, releaseEnvDocs } from './release-branch';

describe('localBranchState', () => {
  it('is missing without a local branch, whatever origin has', () => {
    expect(localBranchState(false, { remoteInLocal: false, localInRemote: false })).toBe('missing');
  });

  it.each([
    [ 'current', { remoteInLocal: true, localInRemote: true } ],
    [ 'ahead', { remoteInLocal: true, localInRemote: false } ],
    [ 'behind', { remoteInLocal: false, localInRemote: true } ],
    [ 'diverged', { remoteInLocal: false, localInRemote: false } ],
  ] as const)('is %s', (state, relation) => {
    expect(localBranchState(true, relation)).toBe(state);
  });
});

describe('checkoutPlan', () => {
  const BRANCH = 'release/v2.13.0';

  it('checks a missing branch out from origin and reads origin', () => {
    const plan = checkoutPlan(BRANCH, 'missing');

    expect(plan.title).toBe('Check out release/v2.13.0 from origin');
    expect(plan.ref).toBe('origin/release/v2.13.0');
  });

  it('reads the local branch when it is current', () => {
    const plan = checkoutPlan(BRANCH, 'current');

    expect(plan.title).toBe('Switch to release/v2.13.0, at the head of origin/release/v2.13.0');
    expect(plan.ref).toBe(BRANCH);
  });

  it('reads the local branch when it is ahead, which is a resumed pick', () => {
    const plan = checkoutPlan(BRANCH, 'ahead');

    expect(plan.title).toBe('Switch to release/v2.13.0, which is ahead of origin/release/v2.13.0 with commits not pushed yet');
    expect(plan.ref).toBe(BRANCH);
  });

  it('fast-forwards a branch that lags and reads origin', () => {
    const plan = checkoutPlan(BRANCH, 'behind');

    expect(plan.title).toBe('Switch to release/v2.13.0 and fast-forward it to origin/release/v2.13.0');
    expect(plan.ref).toBe('origin/release/v2.13.0');
  });

  it('refuses a diverged branch', () => {
    expect(() => checkoutPlan(BRANCH, 'diverged')).toThrow(
      'release/v2.13.0 has diverged from origin/release/v2.13.0; reconcile them by hand and re-run',
    );
  });
});

describe('pickConflictMessage', () => {
  it('names the PR and the conflicted files, and how to resume', () => {
    const pr = { number: 3708, title: 'Fix the thing', labels: [ 'backport' ], mergeSha: '0123456789abcdef0123456789abcdef01234567' };

    expect(pickConflictMessage(pr, [ 'src/a.ts', 'src/b.ts' ])).toBe(
      'Picking #3708 Fix the thing (0123456789) conflicts in src/a.ts, src/b.ts; resolve the conflicts, ' +
      'run "git cherry-pick --continue" and re-run the command, which resumes after this pick',
    );
  });
});

describe('releaseEnvDocs', () => {
  it('releases "upcoming" in each ENV doc that has it, leaving out the others', () => {
    const docs: Record<string, string> = {
      'docs/ENVS.md': '| A | upcoming |\n| B | v2.12.0+ |\n| C | <upcoming> |\n',
      'docs/DEPRECATED_ENVS.md': '| D | v2.11.0+ |\n',
    };

    expect(releaseEnvDocs((docPath) => docs[docPath], 'v2.13.0')).toEqual([
      { path: 'docs/ENVS.md', content: '| A | v2.13.0+ |\n| B | v2.12.0+ |\n| C | v2.13.0+ |\n', count: 2 },
    ]);
  });
});

describe('envDocsStepTitle', () => {
  it('names the docs and the counts the branch has before the picks', () => {
    const docs = [ { path: 'docs/ENVS.md', content: '', count: 2 }, { path: 'docs/DEPRECATED_ENVS.md', content: '', count: 1 } ];

    expect(envDocsStepTitle(docs, 'v2.13.0', 'origin/main')).toBe(
      'Commit "chore: prepare release v2.13.0" with "upcoming" → v2.13.0+ in the ENV docs, when any is left after the picks; ' +
      'at origin/main before them: docs/ENVS.md (2), docs/DEPRECATED_ENVS.md (1)',
    );
  });

  it('says so when the branch has none yet', () => {
    expect(envDocsStepTitle([], 'v2.13.1', 'HEAD')).toBe(
      'Commit "chore: prepare release v2.13.1" with "upcoming" → v2.13.1+ in the ENV docs, when any is left after the picks; ' +
      'at HEAD before them: none',
    );
  });
});
