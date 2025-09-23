import type { ReturnType } from 'lib/api/useApiInfiniteQuery';

export interface SearchQueries {
  addresses: ReturnType<'multichainAggregator:search_addresses'>;
  tokens: ReturnType<'multichainAggregator:search_tokens'>;
  blockNumbers: ReturnType<'multichainAggregator:search_block_numbers'>;
  blocks: ReturnType<'multichainAggregator:search_blocks'>;
  transactions: ReturnType<'multichainAggregator:search_transactions'>;
  nfts: ReturnType<'multichainAggregator:search_nfts'>;
}

export type QueryType = keyof SearchQueries;

export const SEARCH_TABS_NAMES: Record<QueryType, string> = {
  addresses: 'Addresses',
  tokens: 'Tokens (ERC-20)',
  blockNumbers: 'Block numbers',
  blocks: 'Blocks',
  transactions: 'Transactions',
  nfts: 'NFTs (ERC-721 & 1155)',
};
