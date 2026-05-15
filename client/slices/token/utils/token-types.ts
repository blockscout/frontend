// SPDX-License-Identifier: LicenseRef-Blockscout

import { uniqBy } from 'es-toolkit';

import type { NFTTokenType, TokenType } from 'client/slices/token/types/api';
import type { ClusterChainConfig } from 'types/multichain';

import config from 'configs/app';

const tokenStandardName = config.chain.tokenStandard;

type ChainConfig = Array<ClusterChainConfig['app_config']> | ClusterChainConfig['app_config'];

export const NFT_TOKEN_TYPES: Record<NFTTokenType, string> = {
  'ERC-721': `${ tokenStandardName }-721`,
  'ERC-1155': `${ tokenStandardName }-1155`,
  'ERC-404': `${ tokenStandardName }-404`,
};

export const getTokenTypes = (nftOnly: boolean, chainConfig: ChainConfig = config) => {
  if (nftOnly) {
    return NFT_TOKEN_TYPES;
  }

  const chainConfigs = Array.isArray(chainConfig) ? chainConfig : [ chainConfig ];

  return {
    'ERC-20': `${ tokenStandardName }-20`,
    ...chainConfigs
      .map((chainConfig) => chainConfig.chain.additionalTokenTypes)
      .flat()
      .reduce((result, item) => {
        result[item.id] = item.name;
        return result;
      }, {} as Record<string, string>),
    ...NFT_TOKEN_TYPES,
  };
};

export const getAdditionalTokenTypes = (chainConfig?: ChainConfig) => {
  if (!chainConfig) {
    return config.chain.additionalTokenTypes;
  }
  const chainConfigs = Array.isArray(chainConfig) ? chainConfig : [ chainConfig ];
  return uniqBy(
    chainConfigs
      .map((chainConfig) => chainConfig.chain.additionalTokenTypes)
      .flat(),
    (item) => item.id,
  );
};

export const NFT_TOKEN_TYPE_IDS: Array<NFTTokenType> = Object.keys(NFT_TOKEN_TYPES) as Array<NFTTokenType>;

export function getTokenTypeName(typeId: string, chainConfig?: ChainConfig) {
  if (typeId === 'NATIVE') {
    return 'Native token';
  }
  const tokenTypes = getTokenTypes(false, chainConfig);
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
