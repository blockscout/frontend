// SPDX-License-Identifier: LicenseRef-Blockscout

import { uniqBy } from 'es-toolkit';

import type { ClusterChainConfig } from 'src/features/multichain/types/client';
import type { NFTTokenType, TokenType } from 'src/slices/token/types/api';

import config from 'src/config';

const tokenStandardName = config.slices.token.standard;

type ChainConfig = Array<ClusterChainConfig['app_config']> | ClusterChainConfig['app_config'];

type TokenCategory = 'all' | 'nft' | 'fungible';

export const NFT_TOKEN_TYPES: Record<NFTTokenType, string> = {
  'ERC-721': `${ tokenStandardName }-721`,
  'ERC-1155': `${ tokenStandardName }-1155`,
  'ERC-404': `${ tokenStandardName }-404`,
};

export const getTokenTypes = (category: TokenCategory, chainConfig: ChainConfig = config) => {
  if (category === 'nft') {
    return NFT_TOKEN_TYPES;
  }

  const fungibleTokenTypes = {
    'ERC-20': `${ tokenStandardName }-20`,
    ...getAdditionalTokenTypes(chainConfig)
      .reduce((result, item) => {
        result[item.id] = item.name;
        return result;
      }, {} as Record<string, string>),
  };

  if (category === 'fungible') {
    return fungibleTokenTypes;
  }

  return {
    ...fungibleTokenTypes,
    ...NFT_TOKEN_TYPES,
  };
};

export const getAdditionalTokenTypes = (chainConfig?: ChainConfig) => {
  if (!chainConfig) {
    return config.slices.token.additionalTypes;
  }
  const chainConfigs = Array.isArray(chainConfig) ? chainConfig : [ chainConfig ];
  return uniqBy(
    chainConfigs
      .map((chainConfig) => chainConfig.slices.token.additionalTypes)
      .flat(),
    (item) => item.id,
  );
};

export const NFT_TOKEN_TYPE_IDS: Array<NFTTokenType> = Object.keys(NFT_TOKEN_TYPES) as Array<NFTTokenType>;

export function getTokenTypeName(typeId: string, chainConfig?: ChainConfig) {
  if (typeId === 'NATIVE') {
    return 'Native token';
  }
  const tokenTypes = getTokenTypes('all', chainConfig);
  return tokenTypes[typeId as keyof typeof tokenTypes] || typeId;
}

export function isFungibleTokenType(typeId: TokenType, chainConfig?: ChainConfig): boolean {
  return typeId === 'ERC-20' || typeId === 'NATIVE' || getAdditionalTokenTypes(chainConfig).some((item) => item.id === typeId);
}

export function hasTokenTransferValue(typeId: TokenType, chainConfig?: ChainConfig) {
  if (typeId === 'ERC-20' || typeId === 'ERC-1155' || typeId === 'ERC-404') {
    return true;
  }
  return getAdditionalTokenTypes(chainConfig).some((item) => item.id === typeId);
}

export function isConfidentialTokenType(typeId: TokenType): boolean {
  return typeId === 'ERC-7984';
}

export function hasTokenIds(typeId: TokenType) {
  return typeId === 'ERC-1155' || typeId === 'ERC-404';
}
