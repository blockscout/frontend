import { describe, expect, it } from 'vitest';

import { approvedAlpha, describeCommit, docsConflictMessage, needsMainPush, parsePublishArgs, publishState } from './publish';

const HEAD = '0123456789abcdef0123456789abcdef01234567';
const OTHER = 'fedcba9876543210fedcba9876543210fedcba98';

describe('parsePublishArgs', () => {
  it('reads the release tag and its version', () => {
    expect(parsePublishArgs([ 'v2.13.1' ])).toEqual({
      tag: 'v2.13.1',
      version: { major: 2, minor: 13, patch: 1, prerelease: undefined },
      dryRun: false,
    });
  });

  it('reads the dry run', () => {
    expect(parsePublishArgs([ '--dry-run', 'v2.13.0' ])).toMatchObject({ tag: 'v2.13.0', dryRun: true });
  });

  it.each([
    [ 'no tag', [] ],
    [ 'two tags', [ 'v2.13.0', 'v2.13.1' ] ],
  ])('rejects %s with the usage', (_, args) => {
    expect(() => parsePublishArgs(args)).toThrow('Usage: pnpm release publish <vX.Y.Z>');
  });

  it('rejects an alpha tag', () => {
    expect(() => parsePublishArgs([ 'v2.13.0-alpha.1' ])).toThrow('Not a final tag: "v2.13.0-alpha.1"');
  });

  it('rejects an unknown flag', () => {
    expect(() => parsePublishArgs([ 'v2.13.0', '--force' ])).toThrow('Unknown flag: --force');
  });
});

describe('approvedAlpha', () => {
  const BRANCH = 'release/v2.13.0';

  it('is the latest alpha when it tags the branch head', () => {
    expect(approvedAlpha('v2.13.0', BRANCH, HEAD, 'v2.13.0-alpha.2', HEAD)).toBe('v2.13.0-alpha.2');
  });

  it('refuses a release without an alpha', () => {
    expect(() => approvedAlpha('v2.13.0', BRANCH, HEAD, undefined, undefined)).toThrow(
      'v2.13.0 has no alpha tag; cut one with "pnpm release alpha v2.13.0-alpha.1"',
    );
  });

  it('refuses an alpha that is not on the branch', () => {
    expect(() => approvedAlpha('v2.13.0', BRANCH, HEAD, 'v2.13.0-alpha.2', undefined)).toThrow(
      'v2.13.0-alpha.2 is not on release/v2.13.0; cut another alpha of what is there',
    );
  });

  it('refuses a branch that moved past its latest alpha', () => {
    expect(() => approvedAlpha('v2.13.0', BRANCH, HEAD, 'v2.13.0-alpha.2', OTHER)).toThrow(
      'release/v2.13.0 has moved past v2.13.0-alpha.2 (fedcba9876) to 0123456789; cut another alpha of what is there',
    );
  });
});

describe('describeCommit', () => {
  it('shows the short sha and the subject', () => {
    expect(describeCommit({ sha: HEAD, message: 'chore: prepare release v2.13.0\n\nBody.' })).toBe('0123456789 chore: prepare release v2.13.0');
  });
});

describe('docsConflictMessage', () => {
  it('names the commit and the conflicted files, and how to resume', () => {
    const commit = { sha: HEAD, message: 'chore: prepare release v2.13.0' };

    expect(docsConflictMessage(commit, [ 'docs/ENVS.md' ])).toBe(
      'Cherry-picking the docs commit 0123456789 chore: prepare release v2.13.0 onto main conflicts in docs/ENVS.md; ' +
      'resolve the conflicts, run "git cherry-pick --continue" and re-run the command, which resumes after this commit',
    );
  });
});

describe('publishState', () => {
  it('is new when the tag is not on origin', () => {
    expect(publishState('v2.13.0', 'release/v2.13.0', undefined, HEAD)).toBe('new');
  });

  it('resumes a published tag at the branch head', () => {
    expect(publishState('v2.13.0', 'release/v2.13.0', HEAD, HEAD)).toBe('published');
  });

  it('refuses a tag on origin that is not the branch head', () => {
    expect(() => publishState('v2.13.0', 'release/v2.13.0', OTHER, HEAD)).toThrow(
      'v2.13.0 is on origin at fedcba9876, not at the head of release/v2.13.0 (0123456789)',
    );
  });
});

describe('needsMainPush', () => {
  const commit = { sha: HEAD, message: 'chore: prepare release v2.13.0' };

  it('pushes when a docs commit is left to pick', () => {
    expect(needsMainPush({ picks: [ commit ], skipped: [] }, 'current')).toBe(true);
  });

  it('pushes a local main ahead of origin with a continued pick, nothing left to pick', () => {
    expect(needsMainPush({ picks: [], skipped: [ { commit, sha: OTHER } ] }, 'ahead')).toBe(true);
  });

  it.each([ 'missing', 'current', 'behind' ] as const)('leaves main alone when every docs commit is on origin and the local branch is %s', (state) => {
    expect(needsMainPush({ picks: [], skipped: [ { commit, sha: OTHER } ] }, state)).toBe(false);
  });
});
