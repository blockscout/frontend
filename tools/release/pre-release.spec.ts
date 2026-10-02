import { describe, expect, it } from 'vitest';

import type { GithubRelease } from './pre-release';
import { findLinePreRelease, findReleasePreRelease } from './pre-release';

function release(id: number, tagName: string, overrides: Partial<GithubRelease> = {}): GithubRelease {
  return { id, tagName, draft: false, prerelease: false, url: `https://github.com/blockscout/frontend/releases/tag/${ tagName }`, ...overrides };
}

const V2_13 = { major: 2, minor: 13 };

describe('findLinePreRelease', () => {
  it('finds the draft pre-release of the line, whichever tag of the line it names', () => {
    const preRelease = release(3, 'v2.13.1-alpha.2', { draft: true, prerelease: true });
    const releases = [ release(1, 'v2.12.3'), release(2, 'v2.13.0'), preRelease, release(4, 'v2.12.4-alpha.1', { prerelease: true }) ];

    expect(findLinePreRelease(releases, V2_13)).toBe(preRelease);
  });

  it('finds a published pre-release too', () => {
    const preRelease = release(1, 'v2.13.0-alpha.1', { prerelease: true });

    expect(findLinePreRelease([ preRelease ], V2_13)).toBe(preRelease);
  });

  it('takes neither a final release of the line nor a pre-release of another line', () => {
    const releases = [ release(1, 'v2.13.0'), release(2, 'v2.130.0-alpha.1', { prerelease: true }), release(3, 'v3.13.0', { prerelease: true }) ];

    expect(findLinePreRelease(releases, V2_13)).toBeUndefined();
  });

  it('skips a release whose tag is not a release tag', () => {
    expect(findLinePreRelease([ release(1, 'untagged-v2.13', { draft: true, prerelease: true }) ], V2_13)).toBeUndefined();
  });

  it('throws when the line has more than one pre-release', () => {
    const releases = [ release(1, 'v2.13.0', { draft: true, prerelease: true }), release(2, 'v2.13.0-alpha.1', { prerelease: true }) ];

    expect(() => findLinePreRelease(releases, V2_13)).toThrow('Line v2.13 has 2 pre-releases (v2.13.0, v2.13.0-alpha.1); delete all but one');
  });
});

describe('findReleasePreRelease', () => {
  const V2_13_1 = { major: 2, minor: 13, patch: 1, prerelease: undefined };

  it('finds the pre-release of the version, whichever of its tags it names', () => {
    const preRelease = release(2, 'v2.13.1-alpha.1', { draft: true, prerelease: true });

    expect(findReleasePreRelease([ release(1, 'v2.13.0'), preRelease ], V2_13_1)).toBe(preRelease);
  });

  it('throws when the version has no pre-release', () => {
    expect(() => findReleasePreRelease([ release(1, 'v2.13.0') ], V2_13_1)).toThrow(
      'Release v2.13.1 has no pre-release; create it with "pnpm release prepare v2.13.1"',
    );
  });

  it('never takes over the open pre-release of another version of the line', () => {
    const open = release(1, 'v2.13.0', { draft: true, prerelease: true });

    expect(() => findReleasePreRelease([ open ], V2_13_1)).toThrow(
      'The open pre-release of line v2.13 is v2.13.0 (https://github.com/blockscout/frontend/releases/tag/v2.13.0), not v2.13.1; publish it first',
    );
  });
});
