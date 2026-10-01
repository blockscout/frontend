import { describe, expect, it } from 'vitest';

import { parsePrNumber } from './check-pr';

const USAGE = 'Usage: pnpm release check-pr <number>';

describe('parsePrNumber', () => {
  it('reads the PR number', () => {
    expect(parsePrNumber([ '3747' ])).toBe(3747);
  });

  it.each([
    [ 'no argument', [] ],
    [ 'two arguments', [ '1', '2' ] ],
    [ 'a non-number', [ 'abc' ] ],
    [ 'a hash-prefixed number', [ '#3747' ] ],
    [ 'zero', [ '0' ] ],
  ])('rejects %s with the usage', (_, args) => {
    expect(() => parsePrNumber(args)).toThrow(USAGE);
  });

  it('rejects an unknown flag', () => {
    expect(() => parsePrNumber([ '3747', '--dry-run' ])).toThrow('Unknown flag: --dry-run');
  });
});
