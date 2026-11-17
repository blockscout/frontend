// SPDX-License-Identifier: LicenseRef-Blockscout

import { TokenInfo_TokenType } from '@blockscout/interchain-indexer-types';

import { describe, expect, it } from 'vitest';

import { isNativeToken, toCoreTokenType } from './token-type';

describe('toCoreTokenType', () => {
  it('maps every served indexer kind to its core token type', () => {
    expect(toCoreTokenType(TokenInfo_TokenType.ERC20)).toBe('ERC-20');
    expect(toCoreTokenType(TokenInfo_TokenType.NATIVE)).toBe('NATIVE');
    expect(toCoreTokenType(TokenInfo_TokenType.ERC721)).toBe('ERC-721');
    expect(toCoreTokenType(TokenInfo_TokenType.ERC1155)).toBe('ERC-1155');
  });

  it('falls back to ERC-20 for a missing or unknown kind', () => {
    expect(toCoreTokenType(undefined)).toBe('ERC-20');
    expect(toCoreTokenType(TokenInfo_TokenType.UNSPECIFIED)).toBe('ERC-20');
    expect(toCoreTokenType(TokenInfo_TokenType.UNRECOGNIZED)).toBe('ERC-20');
  });
});

describe('isNativeToken', () => {
  it('is true only for the native kind', () => {
    expect(isNativeToken(TokenInfo_TokenType.NATIVE)).toBe(true);
    expect(isNativeToken(TokenInfo_TokenType.ERC20)).toBe(false);
    expect(isNativeToken(undefined)).toBe(false);
  });
});
