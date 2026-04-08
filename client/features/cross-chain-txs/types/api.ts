import type * as interchainIndexer from '@blockscout/interchain-indexer-types';

export interface CrossChainMessageFilters {
  q?: string;
}

export interface CrossChainTransferFilters {
  q?: string;
}

export interface CrossChainChainsStatsFilters {
  chain_ids?: string;
}

export interface CrossChainChainsStatsSorting {
  sort: 'unique_transfer_users_count';
  order: Exclude<interchainIndexer.SortOrder, interchainIndexer.SortOrder.UNRECOGNIZED>;
}

export type CrossChainChainsStatsSortingField = CrossChainChainsStatsSorting['sort'];

export type CrossChainChainsStatsSortingValue = `${ CrossChainChainsStatsSortingField }-${ CrossChainChainsStatsSorting['order'] }` | 'default';
