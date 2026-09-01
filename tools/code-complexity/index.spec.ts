import { describe, it, expect } from 'vitest';

import { DEFAULT_BASE_REF, DEFAULT_MAX_COGNITIVE_BEHAVIOR, DEFAULT_MAX_COGNITIVE_JSX, DEFAULT_MAX_CRAP } from './config';
import { parseArgs } from './index';

// Caps used as flag values: arbitrary, but distinct from every default so an assertion can only pass
// if the flag actually took effect.
const CAP = 7;
const OTHER_CAP = 9;

describe('parseArgs', () => {
  it('defaults to full-repo mode with the configured thresholds', () => {
    expect(parseArgs([])).toEqual({
      baseRef: DEFAULT_BASE_REF,
      diffSelected: false,
      maxCognitiveJsx: DEFAULT_MAX_COGNITIVE_JSX,
      maxCognitiveBehavior: DEFAULT_MAX_COGNITIVE_BEHAVIOR,
      maxCrap: DEFAULT_MAX_CRAP,
      coverageMode: 'generate',
      coverageFile: undefined,
      verbose: false,
      focusPaths: [],
    });
  });

  it('collects non-flag arguments as focus paths', () => {
    expect(parseArgs([ 'src/a.ts', 'src/b.tsx' ]).focusPaths).toEqual([ 'src/a.ts', 'src/b.tsx' ]);
  });

  it('reads the switch flags', () => {
    expect(parseArgs([ '--verbose' ]).verbose).toBe(true);
    expect(parseArgs([ '--no-coverage' ]).coverageMode).toBe('off');
  });

  it('rejects a value passed to a switch flag', () => {
    expect(() => parseArgs([ '--verbose=yes' ])).toThrow('--verbose takes no value');
  });

  it('reads a value flag in both the separate-token and inline forms', () => {
    expect(parseArgs([ '--coverage-file', 'coverage/final.json' ])).toMatchObject({
      coverageMode: 'file',
      coverageFile: 'coverage/final.json',
    });
    expect(parseArgs([ '--coverage-file=coverage/final.json' ])).toMatchObject({
      coverageMode: 'file',
      coverageFile: 'coverage/final.json',
    });
  });

  it('does not let a value flag swallow the following flag', () => {
    expect(parseArgs([ '--coverage-file=coverage/final.json', '--verbose' ])).toMatchObject({
      coverageFile: 'coverage/final.json',
      verbose: true,
    });
  });

  it('selects diff mode from --changed, with an optional inline ref', () => {
    expect(parseArgs([ '--changed' ])).toMatchObject({ diffSelected: true, baseRef: DEFAULT_BASE_REF });
    expect(parseArgs([ '--changed=upstream/main' ])).toMatchObject({ diffSelected: true, baseRef: 'upstream/main' });
  });

  // The CI invocation: --changed must not consume --coverage-file as its ref.
  it('leaves the token after a bare --changed alone', () => {
    expect(parseArgs([ '--changed', '--coverage-file', 'coverage/final.json' ])).toMatchObject({
      diffSelected: true,
      baseRef: DEFAULT_BASE_REF,
      coverageMode: 'file',
      coverageFile: 'coverage/final.json',
    });
  });

  it('selects diff mode from --base and takes its ref', () => {
    expect(parseArgs([ '--base', 'upstream/main' ])).toMatchObject({ diffSelected: true, baseRef: 'upstream/main' });
    expect(parseArgs([ '--base=upstream/main' ])).toMatchObject({ diffSelected: true, baseRef: 'upstream/main' });
  });

  it('overrides the cognitive caps per class', () => {
    expect(parseArgs([ '--max-cognitive-jsx', String(CAP) ])).toMatchObject({
      maxCognitiveJsx: CAP,
      maxCognitiveBehavior: DEFAULT_MAX_COGNITIVE_BEHAVIOR,
    });
    expect(parseArgs([ '--max-cognitive-behavior', String(CAP) ])).toMatchObject({
      maxCognitiveJsx: DEFAULT_MAX_COGNITIVE_JSX,
      maxCognitiveBehavior: CAP,
    });
  });

  it('does not let --max-cognitive shadow its longer siblings', () => {
    expect(parseArgs([ '--max-cognitive-jsx=' + String(CAP) ]).maxCognitiveJsx).toBe(CAP);
    expect(parseArgs([ '--max-cognitive-jsx=' + String(CAP) ]).maxCognitiveBehavior).toBe(DEFAULT_MAX_COGNITIVE_BEHAVIOR);
  });

  it('clamps both cognitive caps from bare --max-cognitive', () => {
    expect(parseArgs([ '--max-cognitive', String(CAP) ])).toMatchObject({
      maxCognitiveJsx: CAP,
      maxCognitiveBehavior: CAP,
    });
  });

  it('overrides the CRAP cap', () => {
    expect(parseArgs([ '--max-crap', String(CAP) ]).maxCrap).toBe(CAP);
  });

  it('applies the last of two conflicting overrides', () => {
    expect(parseArgs([ '--max-crap', String(CAP), '--max-crap', String(OTHER_CAP) ]).maxCrap).toBe(OTHER_CAP);
  });

  it('combines flags and focus paths in any order', () => {
    expect(parseArgs([ '--verbose', 'src/a.ts', '--max-crap=' + String(CAP), 'src/b.ts' ])).toMatchObject({
      verbose: true,
      maxCrap: CAP,
      focusPaths: [ 'src/a.ts', 'src/b.ts' ],
    });
  });

  it('rejects an unknown flag', () => {
    expect(() => parseArgs([ '--nope' ])).toThrow('Unknown flag: --nope');
    // A near-miss of a real flag is unknown too, not a loose prefix match.
    expect(() => parseArgs([ '--max-crappy=1' ])).toThrow('Unknown flag: --max-crappy');
  });

  it('rejects a value flag with no value', () => {
    expect(() => parseArgs([ '--max-crap' ])).toThrow('Missing value for --max-crap');
    expect(() => parseArgs([ '--base' ])).toThrow('Missing value for --base');
  });

  it('rejects a cap that is not a positive number', () => {
    expect(() => parseArgs([ '--max-crap', 'abc' ])).toThrow('Invalid value for --max-crap: abc');
    expect(() => parseArgs([ '--max-crap', '0' ])).toThrow('Invalid value for --max-crap: 0');
    expect(() => parseArgs([ '--max-cognitive=-1' ])).toThrow('Invalid value for --max-cognitive: -1');
  });
});
