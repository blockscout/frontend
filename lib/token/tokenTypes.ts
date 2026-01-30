import type { NFTTokenType, TokenType } from 'types/api/token';
import type { ClusterChainConfig } from 'types/multichain';

import config from 'configs/app';

const tokenStandardName = config.chain.tokenStandard;
const additionalTokenTypes = config.chain.additionalTokenTypes;

export const NFT_TOKEN_TYPES: Record<NFTTokenType, string> = {
  'ERC-721': `${ tokenStandardName }-721`,
  'ERC-1155': `${ tokenStandardName }-1155`,
  'ERC-404': `${ tokenStandardName }-404`,
};

// TODO @tom2drum maybe, pass an array of chain configs
export const getTokenTypes = (nftOnly: boolean, chainConfig = config, additionalTokenTypes?: Record<string, string>) => {
  if (nftOnly) {
    return NFT_TOKEN_TYPES;
  }
  return {
    'ERC-20': `${ tokenStandardName }-20`,
    ...additionalTokenTypes,
    ...chainConfig.chain.additionalTokenTypes.reduce((result, item) => {
      result[item.id] = item.name;
      return result;
    }, {} as Record<string, string>),
    ...NFT_TOKEN_TYPES,
  };
};

export const NFT_TOKEN_TYPE_IDS: Array<NFTTokenType> = Object.keys(NFT_TOKEN_TYPES) as Array<NFTTokenType>;

export function getTokenTypeName(typeId: string, chainConfig?: ClusterChainConfig['app_config']) {
  if (typeId === 'NATIVE') {
    return 'Native token';
  }
  const tokenTypes = getTokenTypes(false, chainConfig);
  return tokenTypes[typeId as keyof typeof tokenTypes] || typeId;
}

export function isFungibleTokenType(typeId: TokenType): boolean {
  return typeId === 'ERC-20' || typeId === 'NATIVE' || additionalTokenTypes.some((item) => item.id === typeId);
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
