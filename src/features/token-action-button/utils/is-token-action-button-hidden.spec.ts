// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { isTokenActionButtonHidden, TOKEN_ACTION_BUTTON_HIDDEN_TAG_SLUG } from './is-token-action-button-hidden';

describe('isTokenActionButtonHidden', () => {
  it('is true when the address carries the service tag with the blacklist slug', () => {
    expect(isTokenActionButtonHidden([
      { slug: 'uniswap', tagType: 'protocol' },
      { slug: TOKEN_ACTION_BUTTON_HIDDEN_TAG_SLUG, tagType: 'service' },
    ])).toBe(true);
  });

  it('is false for the blacklist slug under another tag type', () => {
    expect(isTokenActionButtonHidden([ { slug: TOKEN_ACTION_BUTTON_HIDDEN_TAG_SLUG, tagType: 'generic' } ])).toBe(false);
  });

  it('is false for another service tag', () => {
    expect(isTokenActionButtonHidden([ { slug: 'some_future_flag', tagType: 'service' } ])).toBe(false);
  });

  it('is false without tags', () => {
    expect(isTokenActionButtonHidden(undefined)).toBe(false);
    expect(isTokenActionButtonHidden([])).toBe(false);
  });
});
