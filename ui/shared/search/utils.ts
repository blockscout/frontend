import type { SearchResultItem } from 'types/api/search';
import type { MarketplaceAppOverview } from 'types/client/marketplace';

import config from 'configs/app';

export type ApiCategory = 'token' | 'nft' | 'address' | 'public_tag' | 'transaction' | 'block' | 'user_operation';
export type Category = ApiCategory | 'app';

export type ItemsCategoriesMap =
Record<ApiCategory, Array<SearchResultItem>> &
Record<'app', Array<MarketplaceAppOverview>>;

export type SearchResultAppItem = {
  type: 'app';
  app: MarketplaceAppOverview;
}

export const searchCategories: Array<{id: Category; title: string }> = [
  { id: 'app', title: 'DApps' },
  { id: 'token', title: 'Tokens (ERC-20)' },
  { id: 'nft', title: 'NFTs (ERC-721 & 1155)' },
  { id: 'address', title: 'Addresses' },
  { id: 'public_tag', title: 'Public tags' },
  { id: 'transaction', title: 'Transactions' },
  { id: 'block', title: 'Blocks' },
];

if (config.features.userOps.isEnabled) {
  searchCategories.push({ id: 'user_operation', title: 'User operations' });
}

export const searchItemTitles: Record<Category, { itemTitle: string; itemTitleShort: string }> = {
  app: { itemTitle: 'DApp', itemTitleShort: 'App' },
  token: { itemTitle: 'Token', itemTitleShort: 'Token' },
  nft: { itemTitle: 'NFT', itemTitleShort: 'NFT' },
  address: { itemTitle: 'Address', itemTitleShort: 'Address' },
  public_tag: { itemTitle: 'Public tag', itemTitleShort: 'Tag' },
  transaction: { itemTitle: 'Transaction', itemTitleShort: 'Txn' },
  block: { itemTitle: 'Block', itemTitleShort: 'Block' },
  user_operation: { itemTitle: 'User operation', itemTitleShort: 'User op' },
};

export function getItemCategory(item: SearchResultItem | SearchResultAppItem): Category | undefined {
  switch (item.type) {
    case 'address':
    case 'contract': {
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
  }
}
