import type { MarketplaceAppOverview } from 'types/client/marketplace';
import type { SearchResultItem } from 'types/client/search';

import config from 'configs/app';

export type ApiCategory = 'token' | 'nft' | 'address' | 'public_tag' | 'transaction' | 'block' | 'user_operation' | 'blob' | 'domain' | 'tac_operation';
export type Category = ApiCategory | 'app';

export type ItemsCategoriesMap =
Record<ApiCategory, Array<SearchResultItem>> &
Record<'app', Array<MarketplaceAppOverview>>;

export type SearchResultAppItem = {
  type: 'app';
  app: MarketplaceAppOverview;
};

export const searchCategories: Array<{ id: Category; title: string }> = [
  { id: 'app', title: 'DApps' },
  { id: 'token', title: `Tokens (${ config.chain.tokenStandard }-20)` },
  { id: 'nft', title: `NFTs (${ config.chain.tokenStandard }-721 & 1155)` },
  { id: 'address', title: 'Addresses' },
  { id: 'public_tag', title: 'Public tags' },
  { id: 'transaction', title: 'Transactions' },
  { id: 'block', title: 'Blocks' },
  { id: 'tac_operation', title: 'Operations' },
];

if (config.features.userOps.isEnabled) {
  searchCategories.push({ id: 'user_operation', title: 'User operations' });
}

if (config.features.dataAvailability.isEnabled) {
  searchCategories.push({ id: 'blob', title: 'Blobs' });
}

if (config.features.nameService.isEnabled) {
  searchCategories.unshift({ id: 'domain', title: 'Names' });
}

export const searchItemTitles: Record<Category, { itemTitle: string; itemTitleShort: string }> = {
  app: { itemTitle: 'DApp', itemTitleShort: 'App' },
  domain: { itemTitle: 'Name', itemTitleShort: 'Name' },
  token: { itemTitle: 'Token', itemTitleShort: 'Token' },
  nft: { itemTitle: 'NFT', itemTitleShort: 'NFT' },
  address: { itemTitle: 'Address', itemTitleShort: 'Address' },
  public_tag: { itemTitle: 'Public tag', itemTitleShort: 'Tag' },
  transaction: { itemTitle: 'Transaction', itemTitleShort: 'Txn' },
  block: { itemTitle: 'Block', itemTitleShort: 'Block' },
  user_operation: { itemTitle: 'User operation', itemTitleShort: 'User op' },
  blob: { itemTitle: 'Blob', itemTitleShort: 'Blob' },
  tac_operation: { itemTitle: 'Operations', itemTitleShort: 'Operations' },
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
    case 'tac_operation': {
      return 'tac_operation';
    }
  }
}
