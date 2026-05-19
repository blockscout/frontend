import { describe, it, expect } from 'vitest';

import { encodeVnsName, tryDecodeVnsName } from './encodeVnsName';

describe('encodeVnsName', () => {
  it('round-trips a plain ASCII name unchanged', () => {
    const encoded = encodeVnsName('vitalik.vinu');
    expect(encoded).toBe('vitalik.vinu');
  });

  it('encodes path separators', () => {
    const encoded = encodeVnsName('foo/bar.vinu');
    expect(encoded).toBe('foo%2Fbar.vinu');
  });

  it('encodes URL meta characters', () => {
    expect(encodeVnsName('foo?bar')).toBe('foo%3Fbar');
    expect(encodeVnsName('foo#bar')).toBe('foo%23bar');
  });

  it('encodes spaces', () => {
    expect(encodeVnsName('foo bar')).toBe('foo%20bar');
  });

  it('encodes non-ASCII safely', () => {
    expect(encodeVnsName('münchen.vinu')).toBe('m%C3%BCnchen.vinu');
  });

  it('returns empty string for empty input', () => {
    expect(encodeVnsName('')).toBe('');
  });
});

describe('tryDecodeVnsName', () => {
  it('decodes a valid percent-encoded name', () => {
    expect(tryDecodeVnsName('foo%2Fbar')).toBe('foo/bar');
  });

  it('returns the empty string for empty input', () => {
    expect(tryDecodeVnsName('')).toBe('');
  });

  it('returns the fallback value on malformed percent-encoding', () => {
    expect(tryDecodeVnsName('%E0%A4%A')).toBe('');
    expect(tryDecodeVnsName('%')).toBe('');
    expect(tryDecodeVnsName('%XY')).toBe('');
  });

  it('respects an explicit fallback', () => {
    expect(tryDecodeVnsName('%XY', '<invalid>')).toBe('<invalid>');
  });

  it('round-trips with encodeVnsName', () => {
    const orig = 'foo/bar?baz#qux';
    expect(tryDecodeVnsName(encodeVnsName(orig))).toBe(orig);
  });
});
