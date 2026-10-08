import { describe, expect, it } from 'vitest';

import type { TagCheckSource } from './check-tag';
import { checkTag, parseCheckTagArgs } from './check-tag';

describe('parseCheckTagArgs', () => {
  it('reads the tag', () => {
    expect(parseCheckTagArgs([ 'v2.13.0-alpha.1' ])).toBe('v2.13.0-alpha.1');
  });

  it.each([
    [ 'no tag', [] ],
    [ 'two tags', [ 'v2.13.0', 'v2.13.1' ] ],
  ])('rejects %s with the usage', (_, args) => {
    expect(() => parseCheckTagArgs(args)).toThrow('Usage: pnpm release check-tag <tag>');
  });

  it('rejects a tag that is not a release tag', () => {
    expect(() => parseCheckTagArgs([ 'main' ])).toThrow('Not a release tag: "main"');
  });

  it('rejects an unknown flag', () => {
    expect(() => parseCheckTagArgs([ 'v2.13.0', '--dry-run' ])).toThrow('Unknown flag: --dry-run');
  });
});

function source(docs: Record<string, string>, bodies: ReadonlyArray<string>): TagCheckSource {
  const labels = new Map<number, ReadonlyArray<string>>([ [ 3708, [ 'bug', 'v2.11.2' ] ], [ 3750, [ 'feature' ] ] ]);
  return {
    readDoc: (docPath) => docs[docPath] ?? '',
    releaseBodies: () => bodies,
    prLabels: (number) => labels.get(number),
  };
}

describe('checkTag', () => {
  const cleanDocs = { 'docs/ENVS.md': '| A | v2.13.0+ |', 'docs/DEPRECATED_ENVS.md': '| B | v2.12.0+ |' };

  it('passes released docs and notes of unshipped PRs', () => {
    expect(checkTag('v2.13.0', source(cleanDocs, [ '- #3750' ]))).toEqual({ hasRelease: true, failures: [] });
  });

  it('passes the notes check when the tag has no release', () => {
    expect(checkTag('v2.13.0', source(cleanDocs, []))).toEqual({ hasRelease: false, failures: [] });
  });

  it('reports each stale doc line and each shipped PR, across every release of the tag', () => {
    const docs = { 'docs/ENVS.md': '| A | upcoming |', 'docs/DEPRECATED_ENVS.md': '| B | upcoming |' };

    expect(checkTag('v2.13.0', source(docs, [ '- #3750', 'https://github.com/blockscout/frontend/pull/3708' ]))).toEqual({
      hasRelease: true,
      failures: [
        'docs/ENVS.md:1 still says "upcoming": | A | upcoming |',
        'docs/DEPRECATED_ENVS.md:1 still says "upcoming": | B | upcoming |',
        '#3708 is listed in the notes but already shipped in v2.11.2',
      ],
    });
  });
});
