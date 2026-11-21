// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { getWatchAssetDecimals } from './get-watch-asset-decimals';

describe('getWatchAssetDecimals', () => {
  it('keeps zero decimals as zero', () => {
    expect(getWatchAssetDecimals('0')).toBe(0);
  });

  it('converts the decimals of a token to a number', () => {
    expect(getWatchAssetDecimals('6')).toBe(6);
  });

  it.each([ null, undefined ])('falls back to 18 when the decimals are %s', (tokenDecimals) => {
    expect(getWatchAssetDecimals(tokenDecimals)).toBe(18);
  });
});
