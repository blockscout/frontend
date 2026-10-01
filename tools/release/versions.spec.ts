import { describe, expect, it } from 'vitest';

import {
  isVersionLabel,
  minorTag,
  parseAlphaTagOrThrow,
  parseLineOrThrow,
  parseTag,
  previousTag,
  releaseBranch,
  versionLabel,
} from './versions';

const TAGS = [
  'v2.11.0-alpha', 'v2.11.0', 'v2.11.1', 'v2.11.5',
  'v2.12.0-alpha', 'v2.12.0-alpha.1', 'v2.12.0', 'v2.12.1', 'v2.12.2', 'v2.12.3',
  'v2.13.0-alpha.1', 'v2.13.0',
  'not-a-tag', 'v2.14.0-alpha.1',
];

describe('parseTag', () => {
  it('reads a final tag', () => {
    expect(parseTag('v2.13.1')).toEqual({ major: 2, minor: 13, patch: 1, prerelease: undefined });
  });

  it('reads a pre-release tag', () => {
    expect(parseTag('v2.13.0-alpha.2')).toEqual({ major: 2, minor: 13, patch: 0, prerelease: 'alpha.2' });
  });

  it.each([ '2.13.0', 'v2.13', 'v2.13.0-', 'release/v2.13', 'v2.13.0 ' ])('rejects %j', (tag) => {
    expect(parseTag(tag)).toBeUndefined();
  });
});

describe('versionLabel', () => {
  it('is the final version, also for a pre-release tag', () => {
    expect(versionLabel('v2.13.0')).toBe('v2.13.0');
    expect(versionLabel('v2.13.1-alpha.3')).toBe('v2.13.1');
  });

  it('throws on a non-tag', () => {
    expect(() => versionLabel('main')).toThrow('Not a release tag: "main"');
  });
});

describe('isVersionLabel', () => {
  it.each([ 'v1.4.0', 'v2.13.10' ])('accepts %s', (label) => {
    expect(isVersionLabel(label)).toBe(true);
  });

  it.each([ 'pre-release', 'v2.13.0-alpha.1', 'version', 'bug' ])('rejects %s', (label) => {
    expect(isVersionLabel(label)).toBe(false);
  });
});

describe('previousTag', () => {
  it('steps back one patch within the line', () => {
    expect(previousTag('v2.12.3', TAGS)).toBe('v2.12.2');
  });

  it('skips a patch missing from the tag list', () => {
    expect(previousTag('v2.11.5', TAGS)).toBe('v2.11.1');
  });

  it('takes the highest final of an earlier minor for a minor release', () => {
    expect(previousTag('v2.13.0', TAGS)).toBe('v2.12.3');
  });

  it('crosses a major boundary for the first minor of a major', () => {
    expect(previousTag('v3.0.0', TAGS)).toBe('v2.13.0');
  });

  it('resolves an alpha as its final would', () => {
    expect(previousTag('v2.13.0-alpha.1', TAGS)).toBe('v2.12.3');
    expect(previousTag('v2.13.1-alpha.1', TAGS)).toBe('v2.13.0');
  });

  it('never picks a pre-release tag', () => {
    expect(previousTag('v2.15.0', TAGS)).toBe('v2.13.0');
  });

  it('does not depend on the order of the tag list', () => {
    expect(previousTag('v2.13.0', [ ...TAGS ].reverse())).toBe('v2.12.3');
  });

  it('stays within an older line for a hotfix on it', () => {
    expect(previousTag('v2.11.6', TAGS)).toBe('v2.11.5');
  });

  it('throws when nothing precedes the tag', () => {
    expect(() => previousTag('v2.11.0', [ 'v2.11.0' ])).toThrow('No release precedes v2.11.0');
  });
});

describe('parseAlphaTagOrThrow', () => {
  it('reads an alpha tag', () => {
    expect(parseAlphaTagOrThrow('v2.13.1-alpha.2')).toEqual({ major: 2, minor: 13, patch: 1, prerelease: 'alpha.2' });
  });

  it.each([ 'v2.13.1', 'v2.13.0-alpha', 'v2.13.0-beta.1', 'v2.13.0-alpha.1.1' ])('rejects %s', (tag) => {
    expect(() => parseAlphaTagOrThrow(tag)).toThrow(`Not an alpha tag: "${ tag }"; expected vX.Y.Z-alpha.N`);
  });

  it('rejects a non-tag as a non-tag', () => {
    expect(() => parseAlphaTagOrThrow('main')).toThrow('Not a release tag: "main"');
  });
});

describe('parseLineOrThrow', () => {
  it('reads a line', () => {
    expect(parseLineOrThrow('v2.13')).toEqual({ major: 2, minor: 13 });
  });

  it.each([ '2.13', 'v2.13.0', 'v2', 'release/v2.13' ])('rejects %s', (line) => {
    expect(() => parseLineOrThrow(line)).toThrow(`Not a release line: "${ line }"; expected vX.Y`);
  });
});

describe('releaseBranch', () => {
  it('names the branch of a line', () => {
    expect(releaseBranch(parseLineOrThrow('v2.13'))).toBe('release/v2.13');
  });

  it('infers the branch of a tag, a hotfix alpha included', () => {
    expect(releaseBranch(parseAlphaTagOrThrow('v2.13.0-alpha.1'))).toBe('release/v2.13');
    expect(releaseBranch(parseAlphaTagOrThrow('v2.13.1-alpha.2'))).toBe('release/v2.13');
    expect(releaseBranch(parseAlphaTagOrThrow('v3.0.4-alpha.1'))).toBe('release/v3.0');
  });
});

describe('minorTag', () => {
  it('is the first release of the line', () => {
    expect(minorTag(parseLineOrThrow('v2.13'))).toBe('v2.13.0');
  });
});
