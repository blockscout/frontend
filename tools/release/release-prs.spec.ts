import { describe, expect, it } from 'vitest';

import type { Commit, PrResolver, ReleasePullRequest, ReleaseSource } from './release-prs';
import { isDocsCommit, isReleasedElsewhere, issuesToLabel, prepareCommitMessage, releasePrs, resolvePr } from './release-prs';

const SOURCE_SHA = 'a'.repeat(40);

function resolver(messages: Record<string, string> = {}, associations: Record<string, number> = {}): PrResolver {
  return {
    commitMessage: (sha) => messages[sha],
    associatedPr: (sha) => associations[sha],
  };
}

function pr(number: number, labels: ReadonlyArray<string> = [], closingIssues: ReleasePullRequest['closingIssues'] = []): ReleasePullRequest {
  const url = `https://github.com/blockscout/frontend/pull/${ number }`;
  return { number, title: `PR ${ number }`, author: 'tom2drum', url, body: '', labels, closingIssues };
}

describe('resolvePr', () => {
  it('follows the cherry-pick trailer to the source commit\'s PR reference', () => {
    const commit = { sha: 'b1', message: `Fix the gas tracker (#3700)\n\n(cherry picked from commit ${ SOURCE_SHA })` };

    expect(resolvePr(commit, resolver({ [SOURCE_SHA]: 'Fix the gas tracker (#3708)' }, { [SOURCE_SHA]: 1, b1: 2 }))).toBe(3708);
  });

  it('falls back to the source commit\'s association when its subject has no reference', () => {
    const commit = { sha: 'b1', message: `Fix the gas tracker\n\n(cherry picked from commit ${ SOURCE_SHA })` };

    expect(resolvePr(commit, resolver({ [SOURCE_SHA]: 'Fix the gas tracker' }, { [SOURCE_SHA]: 3708, b1: 1 }))).toBe(3708);
  });

  it('follows a pick of a pick back to the commit on main', () => {
    const pickedSha = 'c'.repeat(40);
    const commit = { sha: 'b1', message: `Fix\n\n(cherry picked from commit ${ pickedSha })` };
    const messages = { [pickedSha]: `Fix\n\n(cherry picked from commit ${ SOURCE_SHA })`, [SOURCE_SHA]: 'Fix (#3708)' };

    expect(resolvePr(commit, resolver(messages))).toBe(3708);
  });

  it('reads the last PR reference in the subject', () => {
    const commit = { sha: 'b1', message: 'Revert "Add the badge (#3600)" (#3650)\n\nReverts (#3600).' };

    expect(resolvePr(commit, resolver())).toBe(3650);
  });

  it('ignores a PR reference outside the subject', () => {
    const commit = { sha: 'b1', message: 'Fix the badge\n\nFollow-up to (#3600).' };

    expect(resolvePr(commit, resolver({}, { b1: 3655 }))).toBe(3655);
  });

  it('asks the association lookup when there is neither a trailer nor a reference', () => {
    expect(resolvePr({ sha: 'b1', message: 'Merge branch main' }, resolver({}, { b1: 3660, b2: 1 }))).toBe(3660);
  });

  it('resolves to nothing when no step finds a PR', () => {
    expect(resolvePr({ sha: 'b1', message: 'Merge branch main' }, resolver())).toBeUndefined();
  });
});

describe('prepareCommitMessage', () => {
  it('names the release', () => {
    expect(prepareCommitMessage('v2.13.1')).toBe('chore: prepare release v2.13.1');
  });
});

describe('isDocsCommit', () => {
  it('matches the subject naming the tag', () => {
    expect(isDocsCommit({ sha: 'c1', message: 'chore: prepare release v2.13.0\n\nSecond alpha.' }, 'v2.13.0')).toBe(true);
  });

  it('matches the final tag of an alpha', () => {
    expect(isDocsCommit({ sha: 'c1', message: 'chore: prepare release v2.13.0' }, 'v2.13.0-alpha.2')).toBe(true);
  });

  it('does not match another release, a body line, or a pick', () => {
    expect(isDocsCommit({ sha: 'c1', message: 'chore: prepare release v2.12.3' }, 'v2.13.0')).toBe(false);
    expect(isDocsCommit({ sha: 'c1', message: 'Fix (#1)\n\nchore: prepare release v2.13.0' }, 'v2.13.0')).toBe(false);
    expect(isDocsCommit({ sha: 'c1', message: `Fix (#1)\n\n(cherry picked from commit ${ SOURCE_SHA })` }, 'v2.13.0')).toBe(false);
  });
});

describe('isReleasedElsewhere', () => {
  it('is true for a version label of another release', () => {
    expect(isReleasedElsewhere([ 'bug', 'v2.12.1' ], 'v2.13.0')).toBe(true);
  });

  it('is false for the tag\'s own version label, also from its alpha', () => {
    expect(isReleasedElsewhere([ 'v2.13.0' ], 'v2.13.0')).toBe(false);
    expect(isReleasedElsewhere([ 'v2.13.0' ], 'v2.13.0-alpha.2')).toBe(false);
  });

  it('is false without version labels', () => {
    expect(isReleasedElsewhere([ 'pre-release', 'backport' ], 'v2.13.0')).toBe(false);
  });
});

describe('releasePrs', () => {
  function source(commits: ReadonlyArray<Commit>, pullRequests: ReadonlyArray<ReleasePullRequest>): ReleaseSource {
    return {
      ...resolver(),
      tags: () => [ 'v2.12.0', 'v2.12.1', 'v2.13.0-alpha.1' ],
      commits: (from) => (from === 'v2.12.1' ? commits : []),
      pullRequest: (number) => pullRequests.find((pullRequest) => pullRequest.number === number) ?? pr(number),
    };
  }

  it('compares from the computed previous tag', () => {
    const result = releasePrs('v2.13.0-alpha.1', source([ { sha: 'c1', message: 'Add the badge (#10)' } ], []));

    expect(result.previousTag).toBe('v2.12.1');
    expect(result.prs.map(({ number }) => number)).toEqual([ 10 ]);
  });

  it('excludes PRs already released by another version and reports them as skipped', () => {
    const commits = [
      { sha: 'c1', message: 'Add the badge (#10)' },
      { sha: 'c2', message: 'Fix the badge (#11)' },
      { sha: 'c3', message: 'Bump viem (#12)' },
    ];
    const result = releasePrs('v2.13.0', source(commits, [ pr(10, [ 'feature' ]), pr(11, [ 'bug', 'v2.12.1' ]), pr(12, [ 'v2.13.0' ]) ]));

    expect(result.prs.map(({ number }) => number)).toEqual([ 10, 12 ]);
    expect(result.skipped.map(({ number }) => number)).toEqual([ 11 ]);
  });

  it('lists a PR once however many commits resolve to it, in commit order', () => {
    const commits = [
      { sha: 'c1', message: 'Fix the badge (#11)' },
      { sha: 'c2', message: 'Add the badge (#10)' },
      { sha: 'c3', message: 'Fix the badge again (#11)' },
    ];

    expect(releasePrs('v2.13.0', source(commits, [])).prs.map(({ number }) => number)).toEqual([ 11, 10 ]);
  });

  it('reports commits that resolve to no PR', () => {
    const commit = { sha: 'c1', message: 'Merge branch main' };

    expect(releasePrs('v2.13.0', source([ commit ], [])).unresolved).toEqual([ commit ]);
  });

  it('leaves the docs commit out without asking GitHub, for the final tag and its alpha', () => {
    const docsCommit = { sha: 'c1', message: 'chore: prepare release v2.13.0' };
    const asked: Array<string> = [];
    const spied: ReleaseSource = {
      ...source([ docsCommit, { sha: 'c2', message: 'Add the badge (#10)' } ], []),
      associatedPr: (sha) => {
        asked.push(sha);
        return undefined;
      },
    };

    for (const tag of [ 'v2.13.0', 'v2.13.0-alpha.1' ]) {
      const result = releasePrs(tag, spied);
      expect(result.unresolved).toEqual([]);
      expect(result.prs.map(({ number }) => number)).toEqual([ 10 ]);
    }
    expect(asked).toEqual([]);
  });
});

describe('issuesToLabel', () => {
  it('collects the closing issues of every PR once, sorted', () => {
    const prs = [
      pr(10, [], [ { number: 5, labels: [] }, { number: 3, labels: [] } ]),
      pr(11, [], [ { number: 3, labels: [] } ]),
    ];

    expect(issuesToLabel(prs, 'v2.13.0')).toEqual([ 3, 5 ]);
  });

  it('leaves out an issue already in another release, keeping the PR\'s other issues', () => {
    const prs = [ pr(10, [], [ { number: 5, labels: [ 'v2.12.1' ] }, { number: 6, labels: [ 'v2.13.0', 'bug' ] } ]) ];

    expect(issuesToLabel(prs, 'v2.13.0')).toEqual([ 6 ]);
  });
});
