// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { buildAppActionUrl } from './build-app-action-url';

const ADDRESS = '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9';
const TX_HASH = '0xabc';
const placeholders = { address: ADDRESS, chainId: '1', txHash: TX_HASH };

describe('buildAppActionUrl', () => {
  it('substitutes every placeholder, lowercasing the address', () => {
    const result = buildAppActionUrl('https://example.com/{chainId}/{address}?token={address}&tx={txHash}', placeholders, 'Token');
    expect(result).toBe(
      `https://example.com/1/${ ADDRESS.toLowerCase() }?token=${ ADDRESS.toLowerCase() }&tx=${ TX_HASH }&utm_source=blockscout&utm_medium=token`,
    );
  });

  it('appends utm params, with the medium depending on the source', () => {
    expect(buildAppActionUrl('https://example.com/swap', placeholders, 'NFT collection'))
      .toBe('https://example.com/swap?utm_source=blockscout&utm_medium=token');
    expect(buildAppActionUrl('https://example.com/swap', placeholders, 'NFT item'))
      .toBe('https://example.com/swap?utm_source=blockscout&utm_medium=token');
    expect(buildAppActionUrl('https://example.com/swap', placeholders, 'Txn'))
      .toBe('https://example.com/swap?utm_source=blockscout&utm_medium=tx');
  });

  it('replaces missing placeholder values with an empty string', () => {
    const result = buildAppActionUrl(
      'https://example.com/?a={address}&c={chainId}&t={txHash}',
      { address: undefined, chainId: undefined, txHash: undefined },
      'Token',
    );
    expect(result).toBe('https://example.com/?a=&c=&t=&utm_source=blockscout&utm_medium=token');
  });

  it('returns undefined for a malformed template', () => {
    expect(buildAppActionUrl('not a url', placeholders, 'Token')).toBeUndefined();
  });
});
