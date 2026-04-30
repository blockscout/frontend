import type * as interchainIndexer from '@blockscout/interchain-indexer-types';

export interface CrossChainFilters {
  q?: string;
}

export interface CrossChainChainsStatsSorting {
  sort: Exclude<interchainIndexer.StatsChainsSort, interchainIndexer.StatsChainsSort.UNRECOGNIZED>;
  order: Exclude<interchainIndexer.SortOrder, interchainIndexer.SortOrder.UNRECOGNIZED>;
}

export type CrossChainChainsStatsSortingField = CrossChainChainsStatsSorting['sort'];

export type CrossChainChainsStatsSortingValue = `${ CrossChainChainsStatsSortingField }-${ CrossChainChainsStatsSorting['order'] }` | 'default';

export interface CrossChainBridgedTokensSorting {
  sort: Exclude<interchainIndexer.BridgedTokensSort, interchainIndexer.BridgedTokensSort.UNRECOGNIZED>;
  order: Exclude<interchainIndexer.SortOrder, interchainIndexer.SortOrder.UNRECOGNIZED>;
}

export type CrossChainBridgedTokensSortingField = CrossChainBridgedTokensSorting['sort'];

export type CrossChainBridgedTokensSortingValue = `${ CrossChainBridgedTokensSortingField }-${ CrossChainBridgedTokensSorting['order'] }` | 'default';
