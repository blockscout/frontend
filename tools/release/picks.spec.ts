import { describe, expect, it } from 'vitest';

import type { BackportPullRequest, BranchState } from './picks';
import { planPicks } from './picks';

const SHA = {
  old: '1111111111111111111111111111111111111111',
  a: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  b: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
  c: 'cccccccccccccccccccccccccccccccccccccccc',
  pickOfA: 'dddddddddddddddddddddddddddddddddddddddd',
};

function pr(number: number, mergeSha: string, labels: ReadonlyArray<string> = [ 'backport', 'bug' ]): BackportPullRequest {
  return { number, title: `Fix ${ number }`, labels, mergeSha };
}

const MAIN: BranchState['mainCommits'] = [ SHA.a, SHA.b, SHA.c ];

describe('planPicks', () => {
  it('picks in main order, whatever order the PRs come in', () => {
    const plan = planPicks([ pr(3, SHA.c), pr(1, SHA.a), pr(2, SHA.b) ], { mainCommits: MAIN, branchCommits: [] });

    expect(plan.picks.map(({ number }) => number)).toEqual([ 1, 2, 3 ]);
    expect(plan.skipped).toEqual([]);
  });

  it('skips a PR merged before the fork, which the branch has as an ancestor', () => {
    const plan = planPicks([ pr(1, SHA.old), pr(2, SHA.b) ], { mainCommits: MAIN, branchCommits: [] });

    expect(plan.picks.map(({ number }) => number)).toEqual([ 2 ]);
    expect(plan.skipped).toEqual([ { pr: pr(1, SHA.old), reason: 'before-fork' } ]);
  });

  it('skips a PR a branch commit names in its trailer', () => {
    const branchCommits = [ { sha: SHA.pickOfA, message: `Fix 1 (#1)\n\n(cherry picked from commit ${ SHA.a })` } ];
    const plan = planPicks([ pr(1, SHA.a), pr(2, SHA.b) ], { mainCommits: MAIN, branchCommits });

    expect(plan.picks.map(({ number }) => number)).toEqual([ 2 ]);
    expect(plan.skipped).toEqual([ { pr: pr(1, SHA.a), reason: 'picked', sha: SHA.pickOfA } ]);
  });

  it('matches an abbreviated trailer by prefix', () => {
    const branchCommits = [ { sha: SHA.pickOfA, message: `Fix 1\n\n(cherry picked from commit ${ SHA.a.slice(0, 7) })` } ];

    expect(planPicks([ pr(1, SHA.a) ], { mainCommits: MAIN, branchCommits }).picks).toEqual([]);
  });

  it('reads every trailer of a pick of a pick', () => {
    const message = `Fix 1\n\n(cherry picked from commit ${ SHA.old })\n(cherry picked from commit ${ SHA.a })`;
    const branchCommits = [ { sha: SHA.pickOfA, message } ];

    expect(planPicks([ pr(1, SHA.a) ], { mainCommits: MAIN, branchCommits }).picks).toEqual([]);
  });

  it('skips a PR another release shipped, whatever the branch has', () => {
    const released = pr(1, SHA.a, [ 'backport', 'v2.12.3' ]);

    expect(planPicks([ released ], { mainCommits: MAIN, branchCommits: [] }).skipped).toEqual([
      { pr: released, reason: 'released', versionLabels: [ 'v2.12.3' ] },
    ]);
  });

  it('plans nothing when run again after the picks', () => {
    const prs = [ pr(1, SHA.a), pr(2, SHA.b) ];
    const first = planPicks(prs, { mainCommits: MAIN, branchCommits: [] });
    const branchCommits = first.picks.map(({ number, mergeSha }, index) => ({
      sha: `${ index }`.repeat(40),
      message: `Fix ${ number } (#${ number })\n\n(cherry picked from commit ${ mergeSha })`,
    }));

    const second = planPicks(prs, { mainCommits: MAIN, branchCommits });

    expect(first.picks).toHaveLength(2);
    expect(second.picks).toEqual([]);
    expect(second.skipped.map(({ reason }) => reason)).toEqual([ 'picked', 'picked' ]);
  });
});
