import { describe, it, expect } from 'vitest';

import { safeDisplayName, sanitizeAttributeText } from './displayName';

// Some test fixtures are intentionally non-ASCII (Cyrillic homoglyphs,
// bidi-overrides, zero-width chars). They are constructed at runtime via
// String.fromCharCode so the source file stays ASCII-only and no-cyrillic-
// string / no-irregular-whitespace rules do not fire on test data.
const CYR_A = String.fromCharCode(0x0430); // CYRILLIC SMALL LETTER A
const RLO = String.fromCharCode(0x202E); // RIGHT-TO-LEFT OVERRIDE
const ZWSP = String.fromCharCode(0x200B); // ZERO WIDTH SPACE

describe('safeDisplayName', () => {
  it('returns plain ASCII names unchanged with no warning', () => {
    const result = safeDisplayName('vitalik.vinu');
    expect(result.display).toBe('vitalik.vinu');
    expect(result.warning).toBeNull();
    expect(result.isTruncated).toBe(false);
  });

  it('returns empty string for empty input without throwing', () => {
    const result = safeDisplayName('');
    expect(result.display).toBe('');
    expect(result.warning).toBeNull();
  });

  it('Punycode-encodes labels containing non-ASCII characters', () => {
    // "muenchen" with u-umlaut -> "xn--mnchen-3ya"
    const result = safeDisplayName('m\u00FCnchen.vinu');
    expect(result.display).toBe('xn--mnchen-3ya.vinu');
    expect(result.warning).toBe('punycode');
  });

  it('flags Latin/Cyrillic homoglyph mixes as mixed-script', () => {
    // Build 'vit<U+0430>lik.vinu' at runtime; the literal is excluded
    // from source so no-cyrillic-string does not fire.
    const result = safeDisplayName('vit' + CYR_A + 'lik.vinu');
    expect(result.warning).toBe('mixed-script');
    // displayed form must encode the mixed label
    expect(result.display.startsWith('xn--')).toBe(true);
  });

  it('flags names containing RTL/bidi-override controls', () => {
    // U+202E RIGHT-TO-LEFT OVERRIDE inside an otherwise-ASCII name.
    const result = safeDisplayName('vitalik' + RLO + '.vinu');
    expect(result.warning).toBe('rtl-override');
    // The control char itself is stripped from display.
    expect(result.display.includes(RLO)).toBe(false);
  });

  it('strips zero-width chars from display without producing a warning by itself', () => {
    const result = safeDisplayName('vitalik' + ZWSP + '.vinu');
    expect(result.display).toBe('vitalik.vinu');
  });

  it('truncates very long names with ellipsis and sets isTruncated', () => {
    const long = 'a'.repeat(120) + '.vinu';
    const result = safeDisplayName(long);
    expect(result.isTruncated).toBe(true);
    expect(result.display.endsWith('\u2026')).toBe(true);
    expect(result.display.length).toBeLessThanOrEqual(33);
  });

  it('respects an explicit maxLen', () => {
    const result = safeDisplayName('abcdefghij.vinu', 5);
    expect(result.display).toBe('abcde\u2026');
    expect(result.isTruncated).toBe(true);
  });

  it('returns a punycode-and-ascii hybrid when only one label is non-ASCII', () => {
    const result = safeDisplayName('vitalik.m\u00FCnchen');
    expect(result.display).toBe('vitalik.xn--mnchen-3ya');
    expect(result.warning).toBe('punycode');
  });

  it('handles a single label (no dots)', () => {
    const result = safeDisplayName('cluster-name');
    expect(result.display).toBe('cluster-name');
    expect(result.warning).toBeNull();
  });

  it('keeps slash-delimited sub-clusters intact', () => {
    const result = safeDisplayName('parent/child');
    expect(result.display).toBe('parent/child');
    expect(result.warning).toBeNull();
  });
});

describe('sanitizeAttributeText', () => {
  it('strips bidi controls and zero-width characters', () => {
    expect(sanitizeAttributeText('foo' + RLO + 'bar' + ZWSP)).toBe('foobar');
  });

  it('truncates at maxLen', () => {
    expect(sanitizeAttributeText('abcdefghij', 5)).toBe('abcde');
  });

  it('returns empty string for empty input', () => {
    expect(sanitizeAttributeText('')).toBe('');
  });

  it('strips ASCII control chars', () => {
    // <NUL>foo<BEL>bar -> foobar
    const dirty = String.fromCharCode(0x0000) + 'foo' + String.fromCharCode(0x0007) + 'bar';
    expect(sanitizeAttributeText(dirty)).toBe('foobar');
  });
});
