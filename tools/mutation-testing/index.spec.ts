import { describe, expect, it } from 'vitest';

import { DEFAULT_BASE_REF } from './config';
import { parseArgs } from './index';

describe('parseArgs', () => {
  it('defaults to full mode against the configured base ref', () => {
    expect(parseArgs([])).toEqual({
      baseRef: DEFAULT_BASE_REF,
      diffSelected: false,
      focusPaths: [],
    });
  });

  it('collects non-flag arguments as focus paths', () => {
    expect(parseArgs([ 'src/a.ts', 'src/b.tsx' ]).focusPaths).toEqual([ 'src/a.ts', 'src/b.tsx' ]);
  });

  it('selects diff mode from --changed, with an optional inline ref', () => {
    expect(parseArgs([ '--changed' ])).toMatchObject({ diffSelected: true, baseRef: DEFAULT_BASE_REF });
    expect(parseArgs([ '--changed=upstream/main' ])).toMatchObject({ diffSelected: true, baseRef: 'upstream/main' });
  });

  // The CI invocation: --changed must not consume the following token as its ref.
  it('leaves the token after a bare --changed alone', () => {
    expect(parseArgs([ '--changed', 'src/a.ts' ])).toMatchObject({
      diffSelected: true,
      baseRef: DEFAULT_BASE_REF,
      focusPaths: [ 'src/a.ts' ],
    });
  });

  it('selects diff mode from --base and takes its ref', () => {
    expect(parseArgs([ '--base', 'upstream/main' ])).toMatchObject({ diffSelected: true, baseRef: 'upstream/main' });
    expect(parseArgs([ '--base=upstream/main' ])).toMatchObject({ diffSelected: true, baseRef: 'upstream/main' });
  });

  it('combines flags and focus paths in any order', () => {
    expect(parseArgs([ 'src/a.ts', '--changed=upstream/main', 'src/b.ts' ])).toMatchObject({
      diffSelected: true,
      baseRef: 'upstream/main',
      focusPaths: [ 'src/a.ts', 'src/b.ts' ],
    });
  });

  it('rejects an unknown flag', () => {
    expect(() => parseArgs([ '--nope' ])).toThrow('Unknown flag: --nope');
    // A near-miss of a real flag is unknown too, not a loose prefix match.
    expect(() => parseArgs([ '--change=main' ])).toThrow('Unknown flag: --change');
  });

  it('rejects a value flag with no value', () => {
    expect(() => parseArgs([ '--base' ])).toThrow('Missing value for --base');
  });

  it('rejects a value passed to a switch flag', () => {
    expect(() => parseArgs([ '--help=yes' ])).toThrow('--help takes no value');
  });
});
