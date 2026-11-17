import { describe, expect, it } from 'vitest';

import { parseNotesArgs } from './notes';

describe('parseNotesArgs', () => {
  it('reads the tag, printing to stdout by default', () => {
    expect(parseNotesArgs([ 'v2.13.0' ])).toEqual({ tag: 'v2.13.0', out: undefined });
  });

  it('reads the output file', () => {
    expect(parseNotesArgs([ 'v2.13.0-alpha.1', '--out', 'notes.md' ])).toEqual({ tag: 'v2.13.0-alpha.1', out: 'notes.md' });
  });

  it.each([
    [ 'no tag', [] ],
    [ 'two tags', [ 'v2.13.0', 'v2.13.1' ] ],
  ])('rejects %s with the usage', (_, args) => {
    expect(() => parseNotesArgs(args)).toThrow('Usage: pnpm release notes <tag>');
  });

  it('rejects a tag that is not a release tag', () => {
    expect(() => parseNotesArgs([ 'main' ])).toThrow('Not a release tag: "main"');
  });

  it('rejects an unknown flag', () => {
    expect(() => parseNotesArgs([ 'v2.13.0', '--dry-run' ])).toThrow('Unknown flag: --dry-run');
  });
});
