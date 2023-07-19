import type { SearchResultItem } from 'types/api/search';

export type Category = 'token' | 'nft' | 'address' | 'app' | 'public_tag' | 'transaction' | 'block';

export const searchCategories: Array<{id: Category; title: string }> = [
  { id: 'token', title: 'Tokens (ERC-20)' },
  { id: 'nft', title: 'NFTs (ERC-721 & 1155)' },
  { id: 'address', title: 'Addresses' },
  { id: 'app', title: 'Apps' },
  { id: 'public_tag', title: 'Public tags' },
  { id: 'transaction', title: 'Transactions' },
  { id: 'block', title: 'Blocks' },
];

export const searchItemTitles: Record<Category, { itemTitle: string; itemTitleShort: string }> = {
  token: { itemTitle: 'Token', itemTitleShort: 'Token' },
  nft: { itemTitle: 'NFT', itemTitleShort: 'NFT' },
  address: { itemTitle: 'Address', itemTitleShort: 'Address' },
  app: { itemTitle: 'App', itemTitleShort: 'App' },
  public_tag: { itemTitle: 'Public tag', itemTitleShort: 'Tag' },
  transaction: { itemTitle: 'Transaction', itemTitleShort: 'Txn' },
  block: { itemTitle: 'Block', itemTitleShort: 'Block' },
};

export function getItemCategory(item: SearchResultItem): Category | undefined {
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
  }
}
