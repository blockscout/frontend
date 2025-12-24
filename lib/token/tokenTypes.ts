import type { NFTTokenType, TokenType } from 'types/api/token';

import config from 'configs/app';

const tokenStandardName = config.chain.tokenStandard;
const additionalTokenTypes = config.chain.additionalTokenTypes;

export const NFT_TOKEN_TYPES: Record<NFTTokenType, string > = {
  'ERC-721': `${ tokenStandardName }-721`,
  'ERC-1155': `${ tokenStandardName }-1155`,
  'ERC-404': `${ tokenStandardName }-404`,
  ...additionalTokenTypes.reduce((result, item) => {
    if (item.isNFT) {
      result[item.id] = item.name;
    }
    return result;
  }, {} as Record<string, string>),
};

export const TOKEN_TYPES: Record<TokenType, string > = {
  'ERC-20': `${ tokenStandardName }-20`,
  ...additionalTokenTypes.reduce((result, item) => {
    if (!item.isNFT) {
      result[item.id] = item.name;
    }
    return result;
  }, {} as Record<string, string>),
  ...NFT_TOKEN_TYPES,
};

export const NFT_TOKEN_TYPE_IDS: Array<NFTTokenType> = Object.keys(NFT_TOKEN_TYPES) as Array<NFTTokenType>;
export const TOKEN_TYPE_IDS: Array<TokenType> = Object.keys(TOKEN_TYPES) as Array<TokenType>;

export function getTokenTypeName(typeId: TokenType) {
  return TOKEN_TYPES[typeId];
}

export function hasTokenTransferValue(typeId: TokenType) {
  if (typeId === 'ERC-20' || typeId === 'ERC-1155' || typeId === 'ERC-404') {
    return true;
  }
  const additionalTokenType = additionalTokenTypes.find(item => item.id === typeId);
  if (additionalTokenType) {
    return !additionalTokenType.isNFT || additionalTokenType.hasValue;
  }
  return false;
}

export function hasTokenIds(typeId: TokenType) {
  if (typeId === 'ERC-1155' || typeId === 'ERC-404') {
    return true;
  }
  const additionalTokenType = additionalTokenTypes.find(item => item.id === typeId);
  if (additionalTokenType) {
    return additionalTokenType.hasIds;
  }
  return false;
}
