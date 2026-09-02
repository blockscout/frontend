import { describe, expect, it } from 'vitest';

import { DEFAULT_BASE_REF, DEFAULT_BUDGET_MS, MINUTE_MS } from './config';
import { parseArgs } from './index';

describe('parseArgs', () => {
  it('defaults to full mode against the configured base ref, under the configured budget', () => {
    expect(parseArgs([])).toEqual({
      baseRef: DEFAULT_BASE_REF,
      diffSelected: false,
      focusPaths: [],
      budgetMs: DEFAULT_BUDGET_MS,
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

  it('takes the budget in minutes, overriding the default', () => {
    expect(parseArgs([ '--budget', '3' ]).budgetMs).toBe(3 * MINUTE_MS);
    expect(parseArgs([ '--budget=0.5' ]).budgetMs).toBe(MINUTE_MS / 2);
  });

  // Falling back to the default on a bad value would make the flag lie about what bounds the run.
  it('rejects a budget that is not a positive number of minutes', () => {
    expect(() => parseArgs([ '--budget', 'soon' ])).toThrow('--budget takes a positive number of minutes, got: soon');
    expect(() => parseArgs([ '--budget', '0' ])).toThrow('--budget takes a positive number of minutes, got: 0');
    expect(() => parseArgs([ '--budget', '-5' ])).toThrow('--budget takes a positive number of minutes, got: -5');
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
