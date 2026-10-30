// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { isTokenActionButtonHidden } from './is-token-action-button-hidden';

describe('isTokenActionButtonHidden', () => {
  it('is true when the address carries the service tag with the blacklist slug', () => {
    expect(isTokenActionButtonHidden([
      { slug: 'uniswap', tagType: 'protocol' },
      { slug: 'token_action_button_hidden', tagType: 'service' },
    ])).toBe(true);
  });

  it('is false for the blacklist slug under another tag type', () => {
    expect(isTokenActionButtonHidden([ { slug: 'token_action_button_hidden', tagType: 'generic' } ])).toBe(false);
  });

  it('is false for another service tag', () => {
    expect(isTokenActionButtonHidden([ { slug: 'some_future_flag', tagType: 'service' } ])).toBe(false);
  });

  it('is false without tags', () => {
    expect(isTokenActionButtonHidden(undefined)).toBe(false);
    expect(isTokenActionButtonHidden([])).toBe(false);
  });
});
