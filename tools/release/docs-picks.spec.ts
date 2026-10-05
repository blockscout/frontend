import { describe, expect, it } from 'vitest';

import { docsCommits, planDocsPicks, prepareCommitMessage } from './docs-picks';

const SHA = {
  docsA: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  docsB: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
  pick: 'cccccccccccccccccccccccccccccccccccccccc',
  pickOfA: 'dddddddddddddddddddddddddddddddddddddddd',
};

const DOCS_A = { sha: SHA.docsA, message: 'chore: prepare release v2.13.0' };
const DOCS_B = { sha: SHA.docsB, message: 'chore: prepare release v2.13.0\n\nSecond alpha.' };

describe('prepareCommitMessage', () => {
  it('names the release', () => {
    expect(prepareCommitMessage('v2.13.1')).toBe('chore: prepare release v2.13.1');
  });
});

describe('docsCommits', () => {
  it('keeps the commits whose subject is the docs commit of the release, in order', () => {
    const commits = [
      DOCS_A,
      { sha: SHA.pick, message: 'Fix the thing (#3708)\n\n(cherry picked from commit 0123456789abcdef)' },
      { sha: SHA.docsB, message: 'chore: prepare release v2.12.3' },
      DOCS_B,
    ];

    expect(docsCommits(commits, 'v2.13.0')).toEqual([ DOCS_A, DOCS_B ]);
  });

  it('matches the subject only, not a body line', () => {
    const commit = { sha: SHA.pick, message: 'Fix (#1)\n\nchore: prepare release v2.13.0' };

    expect(docsCommits([ commit ], 'v2.13.0')).toEqual([]);
  });
});

describe('planDocsPicks', () => {
  it('picks every docs commit main lacks, in order', () => {
    expect(planDocsPicks([ DOCS_A, DOCS_B ], [])).toEqual({ picks: [ DOCS_A, DOCS_B ], skipped: [] });
  });

  it('skips a docs commit a main commit names in its trailer', () => {
    const main = [ { sha: SHA.pickOfA, message: `chore: prepare release v2.13.0\n\n(cherry picked from commit ${ SHA.docsA })` } ];

    expect(planDocsPicks([ DOCS_A, DOCS_B ], main)).toEqual({ picks: [ DOCS_B ], skipped: [ { commit: DOCS_A, sha: SHA.pickOfA } ] });
  });

  it('matches an abbreviated trailer by prefix', () => {
    const main = [ { sha: SHA.pickOfA, message: `chore: prepare release v2.13.0\n\n(cherry picked from commit ${ SHA.docsA.slice(0, 7) })` } ];

    expect(planDocsPicks([ DOCS_A ], main).picks).toEqual([]);
  });

  it('plans nothing without docs commits', () => {
    expect(planDocsPicks([], [])).toEqual({ picks: [], skipped: [] });
  });
});
