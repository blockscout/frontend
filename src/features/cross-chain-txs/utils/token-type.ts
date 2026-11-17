// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';
import { TokenInfo_TokenType } from '@blockscout/interchain-indexer-types';

export type CoreTokenType = NonNullable<schemas['Token']['type']> | 'NATIVE';

const TOKEN_TYPE_MAP: Partial<Record<TokenInfo_TokenType, CoreTokenType>> = {
  [TokenInfo_TokenType.ERC20]: 'ERC-20',
  [TokenInfo_TokenType.NATIVE]: 'NATIVE',
  [TokenInfo_TokenType.ERC721]: 'ERC-721',
  [TokenInfo_TokenType.ERC1155]: 'ERC-1155',
};

// ERC-20 is the only kind the indexer served before it reported one, so an unknown kind keeps that behaviour.
export function toCoreTokenType(type: TokenInfo_TokenType | undefined): CoreTokenType {
  return (type && TOKEN_TYPE_MAP[type]) ?? 'ERC-20';
}

export function isNativeToken(type: TokenInfo_TokenType | undefined): boolean {
  return type === TokenInfo_TokenType.NATIVE;
}
