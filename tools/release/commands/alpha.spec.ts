import { describe, expect, it } from 'vitest';

import { parseAlphaArgs } from './alpha';

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
