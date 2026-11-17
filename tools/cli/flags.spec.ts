import { describe, expect, it } from 'vitest';

import type { FlagSpec, UnknownTokenPolicy } from './flags';
import { parseArgs } from './flags';

interface TestOptions {
  verbose: boolean;
  base: string | undefined;
  changed: boolean;
  changedRef: string | undefined;
}

const USAGE = 'Usage: test-tool [--verbose] [--base <ref>] [--changed[=<ref>]]';
const REJECT: UnknownTokenPolicy = { kind: 'reject', usage: USAGE };
const PASSTHROUGH: UnknownTokenPolicy = { kind: 'passthrough' };

const FLAGS: ReadonlyMap<string, FlagSpec<TestOptions>> = new Map<string, FlagSpec<TestOptions>>([
  [ '--verbose', { kind: 'switch', apply: (options) => {
    options.verbose = true;
  } } ],
  [ '--base', { kind: 'value', apply: (options, value) => {
    options.base = value;
  } } ],
  [ '--changed', { kind: 'optional', apply: (options, value) => {
    options.changed = true;
    options.changedRef = value;
  } } ],
]);

function initialOptions(): TestOptions {
  return { verbose: false, base: undefined, changed: false, changedRef: undefined };
}

function parse(argv: ReadonlyArray<string>, policy: UnknownTokenPolicy = REJECT) {
  return parseArgs(argv, FLAGS, initialOptions(), policy);
}

describe('parseArgs', () => {
  it('returns the initial options untouched and no rest for an empty argv', () => {
    expect(parse([])).toEqual({ options: initialOptions(), rest: [] });
  });

  it('mutates and returns the options object it was given', () => {
    const options = initialOptions();
    expect(parseArgs([ '--verbose' ], FLAGS, options, REJECT).options).toBe(options);
    expect(options.verbose).toBe(true);
  });

  it('applies a switch flag', () => {
    expect(parse([ '--verbose' ]).options.verbose).toBe(true);
  });

  it('rejects a value passed to a switch flag', () => {
    expect(() => parse([ '--verbose=yes' ])).toThrow('--verbose takes no value');
    expect(() => parse([ '--verbose=yes' ], PASSTHROUGH)).toThrow('--verbose takes no value');
  });

  it('reads a value flag in both the separate-token and inline forms', () => {
    expect(parse([ '--base', 'upstream/main' ])).toEqual({ options: { ...initialOptions(), base: 'upstream/main' }, rest: [] });
    expect(parse([ '--base=upstream/main' ])).toEqual({ options: { ...initialOptions(), base: 'upstream/main' }, rest: [] });
  });

  it('splits an inline value at the first equals sign only', () => {
    expect(parse([ '--base=a=b' ]).options.base).toBe('a=b');
  });

  it('keeps an empty inline value rather than taking the following token', () => {
    expect(parse([ '--base=', 'src/a.ts' ])).toEqual({ options: { ...initialOptions(), base: '' }, rest: [ 'src/a.ts' ] });
  });

  // Swallowing the token after --base=<ref> would drop a positional, and not swallowing it after a
  // bare --base would turn the ref itself into one.
  it('consumes the token after a value flag only when the value is not inline', () => {
    expect(parse([ '--base', 'upstream/main', 'src/a.ts' ]).rest).toEqual([ 'src/a.ts' ]);
    expect(parse([ '--base=upstream/main', 'src/a.ts' ]).rest).toEqual([ 'src/a.ts' ]);
  });

  it('lets a value flag take the following token even when it looks like a flag', () => {
    expect(parse([ '--base', '--verbose' ])).toEqual({ options: { ...initialOptions(), base: '--verbose' }, rest: [] });
  });

  it('rejects a value flag with no value', () => {
    expect(() => parse([ '--base' ])).toThrow('Missing value for --base');
  });

  it('reads an optional flag bare or with an inline value', () => {
    expect(parse([ '--changed' ]).options).toMatchObject({ changed: true, changedRef: undefined });
    expect(parse([ '--changed=upstream/main' ]).options).toMatchObject({ changed: true, changedRef: 'upstream/main' });
  });

  // The CI invocation: a bare --changed is followed by another flag or a positional, never its ref.
  it('never lets an optional flag swallow the following token', () => {
    expect(parse([ '--changed', 'upstream/main' ])).toEqual({
      options: { ...initialOptions(), changed: true, changedRef: undefined },
      rest: [ 'upstream/main' ],
    });
    expect(parse([ '--changed', '--verbose' ]).options).toMatchObject({ changed: true, changedRef: undefined, verbose: true });
  });

  it('collects positionals into rest, in order, under either policy', () => {
    expect(parse([ 'src/a.ts', '--verbose', 'src/b.ts' ]).rest).toEqual([ 'src/a.ts', 'src/b.ts' ]);
    expect(parse([ 'src/a.ts', '--verbose', 'src/b.ts' ], PASSTHROUGH).rest).toEqual([ 'src/a.ts', 'src/b.ts' ]);
  });

  it('applies the last of two conflicting values', () => {
    expect(parse([ '--base', 'one', '--base=two' ]).options.base).toBe('two');
  });

  describe('with the reject policy', () => {
    it('throws on an unknown flag, with the usage text attached', () => {
      expect(() => parse([ '--nope' ])).toThrow(`Unknown flag: --nope\n${ USAGE }`);
    });

    it('names only the flag part of an unknown inline flag', () => {
      expect(() => parse([ '--nope=1' ])).toThrow('Unknown flag: --nope\n');
    });

    // A near-miss of a real flag is unknown too, not a loose prefix match.
    it('does not prefix-match a known flag', () => {
      expect(() => parse([ '--verbosely' ])).toThrow('Unknown flag: --verbosely');
      expect(() => parse([ '--bas=main' ])).toThrow('Unknown flag: --bas');
    });
  });

  describe('with the passthrough policy', () => {
    it('collects unknown flags and positionals into rest in argv order, applying the known ones', () => {
      const argv = [ 'a.pw.tsx', '--project=default', '--verbose', '-g', 'two words', '--changed', '--update-snapshots', 'b.pw.tsx' ];

      expect(parse(argv, PASSTHROUGH)).toEqual({
        options: { ...initialOptions(), verbose: true, changed: true },
        rest: [ 'a.pw.tsx', '--project=default', '-g', 'two words', '--update-snapshots', 'b.pw.tsx' ],
      });
    });

    it('passes an unknown flag through verbatim, inline value included', () => {
      expect(parse([ '--shard=1/3' ], PASSTHROUGH).rest).toEqual([ '--shard=1/3' ]);
    });

    it('still errors on a known flag used wrongly', () => {
      expect(() => parse([ '--base' ], PASSTHROUGH)).toThrow('Missing value for --base');
    });
  });
});
