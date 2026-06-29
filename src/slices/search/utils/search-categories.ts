// SPDX-License-Identifier: LicenseRef-Blockscout

import type { MarketplaceDapp } from '@blockscout/admin-rs-types';
import type { CctxListItem } from '@blockscout/zetachain-cctx-types';
import type { QuickSearchResultItem } from 'src/slices/search/types/client';
import type { TokenType } from 'src/slices/token/types/api';
import { isConfidentialTokenType } from 'src/slices/token/utils/token-types';

import config from 'src/config';
import { getFeaturePayload } from 'src/config/utils/features';

export type ApiCategory =
  'token' |
  'nft' |
  'address' |
  'public_tag' |
  'transaction' |
  'block' |
  'user_operation' |
  'blob' |
  'domain' |
  'cluster' |
  'tac_operation' |
  'confidential_token';
export type Category = ApiCategory | 'app' | 'zetaChainCCTX';

export type ItemsCategoriesMap =
Record<ApiCategory, Array<QuickSearchResultItem>> &
Record<'app', Array<MarketplaceDapp>> &
Record<'zetaChainCCTX', Array<CctxListItem>>;

export type SearchResultAppItem = {
  type: 'app';
  app: MarketplaceDapp;
};

const hasConfidentialTokenType = (chainsConfig: Array<typeof config> = [ config ]) =>
  chainsConfig.some((chainConfig) => chainConfig.slices.token.additionalTypes.some((item) => isConfidentialTokenType(item.id as TokenType)));

export const getSearchCategories =
 (chainsConfig: Array<typeof config> = [ config ]): Array<{ id: Category; title: string; tabTitle: string; itemTitle: string; itemTitleShort: string }> => {
   const nameServicesFeatures = chainsConfig.map((chainConfig) => chainConfig.features.nameServices).filter((feature) => feature?.isEnabled);
   const isEnsEnabled = nameServicesFeatures?.some((feature) => feature?.ens.isEnabled);
   const isClustersEnabled = nameServicesFeatures?.some((feature) => feature?.clusters.isEnabled);
   //  FIXME: We don't support marketplace on multichain yet
   const dappEntityName = getFeaturePayload(config.features.marketplace)?.titles.entity_name ?? '';

   return [
     ...(config.features.marketplace.isEnabled ? [
       {
         id: 'app' as const,
         title: `${ dappEntityName }s`,
         tabTitle: `${ dappEntityName }s`,
         itemTitle: dappEntityName,
         itemTitleShort: dappEntityName,
       },
     ] : []),
     ...(isEnsEnabled || config.features.multichain.isEnabled ? [
       {
         id: 'domain' as const,
         title: 'Names',
         tabTitle: 'Names',
         itemTitle: 'Name',
         itemTitleShort: 'Name',
       },
     ] : []),
     ...(isClustersEnabled ? [
       {
         id: 'cluster' as const,
         title: 'Cluster Name',
         tabTitle: 'Cluster',
         itemTitle: 'Cluster',
         itemTitleShort: 'Cluster',
       },
     ] : []),
     {
       id: 'token',
       title: `Tokens (${ config.slices.token.standard }-20)`,
       tabTitle: 'Tokens',
       itemTitle: 'Token',
       itemTitleShort: 'Token',
     },
     {
       id: 'nft',
       title: `NFTs (${ config.slices.token.standard }-721 & 1155)`,
       tabTitle: 'NFTs',
       itemTitle: 'NFT',
       itemTitleShort: 'NFT',
     },
     ...(hasConfidentialTokenType(chainsConfig) ? [
       {
         id: 'confidential_token' as const,
         title: `Confidential Tokens (${ config.slices.token.standard }-7984)`,
         tabTitle: 'Confidential Tokens',
         itemTitle: 'Confidential Token',
         itemTitleShort: 'Conf. Token',
       },
     ] : []),
     {
       id: 'address',
       title: 'Addresses',
       tabTitle: 'Addresses',
       itemTitle: 'Address',
       itemTitleShort: 'Address',
     },
     {
       id: 'public_tag',
       title: 'Public tags',
       tabTitle: 'Public tags',
       itemTitle: 'Public tag',
       itemTitleShort: 'Tag',
     },
     {
       id: 'transaction',
       title: 'Transactions',
       tabTitle: 'Transactions',
       itemTitle: 'Transaction',
       itemTitleShort: 'Txn',
     },
     {
       id: 'block',
       title: 'Blocks',
       tabTitle: 'Blocks',
       itemTitle: 'Block',
       itemTitleShort: 'Block',
     },
     {
       id: 'tac_operation',
       title: 'Operations',
       tabTitle: 'Operations',
       itemTitle: 'Operation',
       itemTitleShort: 'Operation',
     },
     {
       id: 'zetaChainCCTX',
       title: 'CCTXs',
       tabTitle: 'CCTXs',
       itemTitle: 'CCTX',
       itemTitleShort: 'CCTX',
     },
     ...(config.features.userOps.isEnabled ? [
       {
         id: 'user_operation' as const,
         title: 'User operations',
         tabTitle: 'User ops',
         itemTitle: 'User operation',
         itemTitleShort: 'User op',
       },
     ] : []),
     ...(config.features.dataAvailability.isEnabled ? [
       {
         id: 'blob' as const,
         title: 'Blobs',
         tabTitle: 'Blobs',
         itemTitle: 'Blob',
         itemTitleShort: 'Blob',
       },
     ] : []),
   ];
 };

export function getItemCategory(item: QuickSearchResultItem | SearchResultAppItem, chainConfig: typeof config = config): Category | undefined {
  switch (item.type) {
    case 'address':
    case 'contract':
    case 'metadata_tag': {
      return 'address';
    }
    case 'token': {
      if (item.token_type === 'ERC-20') {
        return 'token';
      }
      if (hasConfidentialTokenType([ chainConfig ]) && isConfidentialTokenType(item.token_type as TokenType)) {
        return 'confidential_token';
      }
      return 'nft';
    }
    case 'block': {
      return 'block';
    }
    case 'label': {
      return 'public_tag';
    }
    case 'transaction': {
      return 'transaction';
    }
    case 'app': {
      return 'app';
    }
    case 'user_operation': {
      return 'user_operation';
    }
    case 'blob': {
      return 'blob';
    }
    case 'ens_domain': {
      return 'domain';
    }
    case 'cluster': {
      return 'cluster';
    }
    case 'tac_operation': {
      return 'tac_operation';
    }
    case 'zetaChainCCTX': {
      return 'zetaChainCCTX';
    }
  }
}
