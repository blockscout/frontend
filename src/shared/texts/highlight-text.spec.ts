// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import highlightText from './highlight-text';

describe('highlightText', () => {
  it('wraps every occurrence of the query in a mark tag', () => {
    expect(highlightText('usd coin and usd tether', 'usd')).toBe('<mark>usd</mark> coin and <mark>usd</mark> tether');
  });

  it('matches regardless of case and keeps the casing of the text', () => {
    expect(highlightText('Wrapped Ether', 'ether')).toBe('Wrapped <mark>Ether</mark>');
  });

  it('treats special characters of the query literally', () => {
    expect(highlightText('price (usd) or pricing', 'price (usd)')).toBe('<mark>price (usd)</mark> or pricing');
  });

  it('returns a text without a match as it is', () => {
    expect(highlightText('Wrapped Ether', 'dai')).toBe('Wrapped Ether');
  });

  it('neutralizes a script tag in the text', () => {
    expect(highlightText('<script>alert(1)</script> token', 'token'))
      .toBe('&lt;script&gt;alert(1)&lt;/script&gt; <mark>token</mark>');
  });

  it('drops an event handler attribute from a tag in the text', () => {
    const result = highlightText('<img src="https://example.com/a.png" onerror="alert(1)"> token', 'token');

    expect(result).not.toContain('onerror');
    expect(result).toContain('<mark>token</mark>');
  });

  it('neutralizes markup that the query itself brings in', () => {
    expect(highlightText('<svg onload=alert(1)>', '<svg onload=alert(1)>')).not.toContain('<svg');
  });
});
