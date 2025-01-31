import type { NFTTokenType, TokenType } from 'types/api/token';

import config from 'configs/app';

const tokenStandardName = config.chain.tokenStandard;

export const NFT_TOKEN_TYPES: Record<NFTTokenType, string > = {
  'ERC-721': `${ tokenStandardName }-721`,
  'ERC-1155': `${ tokenStandardName }-1155`,
  'ERC-404': `${ tokenStandardName }-404`,
};

export const TOKEN_TYPES: Record<TokenType, string > = {
  'ERC-20': `${ tokenStandardName }-20`,
  ...NFT_TOKEN_TYPES,
};

export const NFT_TOKEN_TYPE_IDS: Array<NFTTokenType> = [ 'ERC-721', 'ERC-1155', 'ERC-404' ];
export const TOKEN_TYPE_IDS: Array<TokenType> = [ 'ERC-20', ...NFT_TOKEN_TYPE_IDS ];

export function getTokenTypeName(typeId: TokenType) {
  return TOKEN_TYPES[typeId];
}
