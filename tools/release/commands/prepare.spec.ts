import { describe, expect, it } from 'vitest';

import { baseRef, cutStepTitle, isPicksOnly, parsePrepareArgs } from './prepare';

describe('parsePrepareArgs', () => {
  it('reads the release tag and its version', () => {
    expect(parsePrepareArgs([ 'v2.13.1' ])).toEqual({
      tag: 'v2.13.1',
      version: { major: 2, minor: 13, patch: 1, prerelease: undefined },
      dryRun: false,
    });
  });

  it('reads the dry run', () => {
    expect(parsePrepareArgs([ 'v2.13.0', '--dry-run' ])).toMatchObject({ tag: 'v2.13.0', dryRun: true });
  });

  it.each([
    [ 'no tag', [] ],
    [ 'two tags', [ 'v2.13.0', 'v2.14.0' ] ],
  ])('rejects %s with the usage', (_, args) => {
    expect(() => parsePrepareArgs(args)).toThrow('Usage: pnpm release prepare <vX.Y.Z>');
  });

  it('rejects a line in place of a tag', () => {
    expect(() => parsePrepareArgs([ 'v2.13' ])).toThrow('Not a release tag: "v2.13"');
  });

  it('rejects an alpha tag', () => {
    expect(() => parsePrepareArgs([ 'v2.13.0-alpha.1' ])).toThrow('Not a final tag: "v2.13.0-alpha.1"');
  });

  it('rejects an unknown flag', () => {
    expect(() => parsePrepareArgs([ 'v2.13.0', '--force' ])).toThrow('Unknown flag: --force');
  });
});

describe('baseRef', () => {
  it('reads main from origin for a minor', () => {
    expect(baseRef({ kind: 'main' })).toBe('origin/main');
  });

  it('is the previous tag for a patch', () => {
    expect(baseRef({ kind: 'tag', tag: 'v2.13.0' })).toBe('v2.13.0');
  });
});

describe('cutStepTitle', () => {
  const SHA = '0123456789abcdef0123456789abcdef01234567';

  it('cuts a minor from main', () => {
    expect(cutStepTitle('release/v2.13.0', 'origin/main', SHA, false)).toBe('Cut release/v2.13.0 at origin/main (0123456789)');
  });

  it('cuts a patch from the previous tag', () => {
    expect(cutStepTitle('release/v2.13.1', 'v2.13.0', SHA, false)).toBe('Cut release/v2.13.1 at v2.13.0 (0123456789)');
  });

  it('resumes a branch an earlier run left behind', () => {
    expect(cutStepTitle('release/v2.13.0', 'origin/main', SHA, true)).toBe(
      'Switch to release/v2.13.0, cut at origin/main (0123456789) by an earlier run that stopped; resuming',
    );
  });
});

describe('isPicksOnly', () => {
  const pick = { sha: 'a', message: 'Fix the badge (#3600)\n\n(cherry picked from commit 0123456789abcdef0123456789abcdef01234567)' };
  const docs = { sha: 'b', message: 'chore: prepare release v2.13.0' };

  it('accepts a branch of picks and the docs commit of the release', () => {
    expect(isPicksOnly([ pick, docs ], 'v2.13.0')).toBe(true);
  });

  it('accepts a branch with nothing past the fork point', () => {
    expect(isPicksOnly([], 'v2.13.0')).toBe(true);
  });

  it('refuses a commit made on the branch by hand', () => {
    expect(isPicksOnly([ pick, { sha: 'c', message: 'Fix the badge on the branch' } ], 'v2.13.0')).toBe(false);
  });

  it('refuses the docs commit of another release', () => {
    expect(isPicksOnly([ docs ], 'v2.13.1')).toBe(false);
  });
});
