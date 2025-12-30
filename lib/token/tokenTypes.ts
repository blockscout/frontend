import type { NFTTokenType, TokenType } from 'types/api/token';

import config from 'configs/app';

const tokenStandardName = config.chain.tokenStandard;
const additionalTokenTypes = config.chain.additionalTokenTypes;

export const NFT_TOKEN_TYPES: Record<NFTTokenType, string> = {
  'ERC-721': `${ tokenStandardName }-721`,
  'ERC-1155': `${ tokenStandardName }-1155`,
  'ERC-404': `${ tokenStandardName }-404`,
};

export const TOKEN_TYPES: Record<string, string> = {
  'ERC-20': `${ tokenStandardName }-20`,
  ...additionalTokenTypes.reduce((result, item) => {
    result[item.id] = item.name;
    return result;
  }, {} as Record<string, string>),
  ...NFT_TOKEN_TYPES,
};

export const NFT_TOKEN_TYPE_IDS: Array<NFTTokenType> = Object.keys(NFT_TOKEN_TYPES) as Array<NFTTokenType>;
export const TOKEN_TYPE_IDS = Object.keys(TOKEN_TYPES);

export function getTokenTypeName(typeId: string) {
  return TOKEN_TYPES[typeId] || typeId;
}

export function isFungibleTokenType(typeId: TokenType): boolean {
  return typeId === 'ERC-20' || additionalTokenTypes.some((item) => item.id === typeId);
}

export function hasTokenTransferValue(typeId: TokenType) {
  if (typeId === 'ERC-20' || typeId === 'ERC-1155' || typeId === 'ERC-404') {
    return true;
  }
  return additionalTokenTypes.some((item) => item.id === typeId);
}

export function hasTokenIds(typeId: TokenType) {
  return typeId === 'ERC-1155' || typeId === 'ERC-404';
}
