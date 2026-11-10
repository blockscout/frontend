import { describe, expect, it } from 'vitest';

import { alphaState, parseAlphaArgs } from './alpha';

const HEAD = '0123456789abcdef0123456789abcdef01234567';
const OTHER = 'fedcba9876543210fedcba9876543210fedcba98';

function preRelease(tagName: string, draft = false) {
  return { id: 1, tagName, draft, prerelease: true, url: `https://github.com/blockscout/frontend/releases/tag/${ tagName }` };
}

describe('alphaState', () => {
  it('is new when the tag is not on origin', () => {
    expect(alphaState('v2.13.0-alpha.2', 'release/v2.13.0', undefined, HEAD, preRelease('v2.13.0-alpha.1'))).toBe('new');
  });

  it('resumes a tag at the pushed branch head that the published pre-release points at', () => {
    expect(alphaState('v2.13.0-alpha.2', 'release/v2.13.0', HEAD, HEAD, preRelease('v2.13.0-alpha.2'))).toBe('published');
  });

  it('refuses a tag on origin that is not the pushed branch head', () => {
    expect(() => alphaState('v2.13.0-alpha.2', 'release/v2.13.0', OTHER, HEAD, preRelease('v2.13.0-alpha.1'))).toThrow(
      'v2.13.0-alpha.2 is on origin at fedcba9876, not at the head of origin/release/v2.13.0 (0123456789)',
    );
  });

  it('refuses a tag at the branch head that the pre-release does not point at', () => {
    expect(() => alphaState('v2.13.0-alpha.2', 'release/v2.13.0', HEAD, HEAD, preRelease('v2.13.0-alpha.1'))).toThrow(
      'v2.13.0-alpha.2 is on origin at the head of origin/release/v2.13.0, but the pre-release still points at v2.13.0-alpha.1 ' +
      '(https://github.com/blockscout/frontend/releases/tag/v2.13.0-alpha.1); re-point it to v2.13.0-alpha.2 by hand, or delete the tag from origin and re-run',
    );
  });

  it('refuses a tag at the branch head that a draft pre-release points at', () => {
    expect(() => alphaState('v2.13.0-alpha.2', 'release/v2.13.0', HEAD, HEAD, preRelease('v2.13.0-alpha.2', true))).toThrow(
      'v2.13.0-alpha.2 is on origin at the head of origin/release/v2.13.0 and the pre-release points at it, but is still a draft ' +
      '(https://github.com/blockscout/frontend/releases/tag/v2.13.0-alpha.2); publish it by hand, or delete the tag from origin and re-run',
    );
  });
});

describe('parseAlphaArgs', () => {
  it('reads the alpha tag and its version', () => {
    expect(parseAlphaArgs([ 'v2.13.1-alpha.2' ])).toEqual({
      tag: 'v2.13.1-alpha.2',
      version: { major: 2, minor: 13, patch: 1, prerelease: 'alpha.2' },
      dryRun: false,
    });
  });

  it('reads the dry run', () => {
    expect(parseAlphaArgs([ '--dry-run', 'v2.13.0-alpha.1' ])).toMatchObject({ tag: 'v2.13.0-alpha.1', dryRun: true });
  });

  it.each([
    [ 'no tag', [] ],
    [ 'two tags', [ 'v2.13.0-alpha.1', 'v2.13.0-alpha.2' ] ],
  ])('rejects %s with the usage', (_, args) => {
    expect(() => parseAlphaArgs(args)).toThrow('Usage: pnpm release alpha <vX.Y.Z-alpha.N>');
  });

  it('rejects a final tag', () => {
    expect(() => parseAlphaArgs([ 'v2.13.0' ])).toThrow('Not an alpha tag: "v2.13.0"');
  });

  it('rejects an unknown flag', () => {
    expect(() => parseAlphaArgs([ 'v2.13.0-alpha.1', '--force' ])).toThrow('Unknown flag: --force');
  });
});
