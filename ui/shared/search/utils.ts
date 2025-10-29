import type { CctxListItem } from '@blockscout/zetachain-cctx-types';
import type { MarketplaceApp } from 'types/client/marketplace';
import type { SearchResultItem } from 'types/client/search';

import config from 'configs/app';

const nameServicesFeature = config.features.nameServices;

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
  'tac_operation';
export type Category = ApiCategory | 'app' | 'zetaChainCCTX';

export type ItemsCategoriesMap =
Record<ApiCategory, Array<SearchResultItem>> &
Record<'app', Array<MarketplaceApp>> &
Record<'zetaChainCCTX', Array<CctxListItem>>;

export type SearchResultAppItem = {
  type: 'app';
  app: MarketplaceApp;
};

export const searchCategories: Array<{ id: Category; title: string; tabTitle: string }> = [
  { id: 'app', title: 'DApps', tabTitle: 'DApps' },
  { id: 'token', title: `Tokens (${ config.chain.tokenStandard }-20)`, tabTitle: 'Tokens' },
  { id: 'nft', title: `NFTs (${ config.chain.tokenStandard }-721 & 1155)`, tabTitle: 'NFTs' },
  { id: 'address', title: 'Addresses', tabTitle: 'Addresses' },
  { id: 'public_tag', title: 'Public tags', tabTitle: 'Public tags' },
  { id: 'transaction', title: 'Transactions', tabTitle: 'Transactions' },
  { id: 'block', title: 'Blocks', tabTitle: 'Blocks' },
  { id: 'tac_operation', title: 'Operations', tabTitle: 'Operations' },
  { id: 'zetaChainCCTX', title: 'CCTXs', tabTitle: 'CCTXs' },
];

if (config.features.userOps.isEnabled) {
  searchCategories.push({ id: 'user_operation', title: 'User operations', tabTitle: 'User ops' });
}

if (config.features.dataAvailability.isEnabled) {
  searchCategories.push({ id: 'blob', title: 'Blobs', tabTitle: 'Blobs' });
}

if (nameServicesFeature.isEnabled && nameServicesFeature.ens.isEnabled) {
  searchCategories.unshift({ id: 'domain', title: 'Names', tabTitle: 'Names' });
}

if (nameServicesFeature.isEnabled && nameServicesFeature.clusters.isEnabled) {
  searchCategories.unshift({ id: 'cluster', title: 'Cluster Name', tabTitle: 'Cluster' });
}

export const searchItemTitles: Record<Category, { itemTitle: string; itemTitleShort: string }> = {
  app: { itemTitle: 'DApp', itemTitleShort: 'App' },
  domain: { itemTitle: 'Name', itemTitleShort: 'Name' },
  cluster: { itemTitle: 'Cluster', itemTitleShort: 'Cluster' },
  token: { itemTitle: 'Token', itemTitleShort: 'Token' },
  nft: { itemTitle: 'NFT', itemTitleShort: 'NFT' },
  address: { itemTitle: 'Address', itemTitleShort: 'Address' },
  public_tag: { itemTitle: 'Public tag', itemTitleShort: 'Tag' },
  transaction: { itemTitle: 'Transaction', itemTitleShort: 'Txn' },
  block: { itemTitle: 'Block', itemTitleShort: 'Block' },
  user_operation: { itemTitle: 'User operation', itemTitleShort: 'User op' },
  blob: { itemTitle: 'Blob', itemTitleShort: 'Blob' },
  tac_operation: { itemTitle: 'Operations', itemTitleShort: 'Operations' },
  zetaChainCCTX: { itemTitle: 'CCTX', itemTitleShort: 'CCTX' },
};

export function getItemCategory(item: SearchResultItem | SearchResultAppItem): Category | undefined {
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
