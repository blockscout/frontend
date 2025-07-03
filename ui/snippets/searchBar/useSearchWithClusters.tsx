import React from 'react';

import type { SearchResultCluster } from 'types/api/search';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';

import useQuickSearchQuery from './useQuickSearchQuery';

function isClusterSearch(term: string): boolean {
  const trimmed = term.trim();
  const hasTrailingSlash = trimmed.endsWith('/');
  const looksLikeCluster = trimmed.includes('/') || hasTrailingSlash;

  return looksLikeCluster;
}

function extractClusterName(term: string): string {
  const trimmed = term.trim();
  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
}

function transformClusterToSearchResult(cluster: {
  name: string;
  clusterId?: string;
  owner: string;
  createdAt?: string;
  expiresAt?: string | null;
  backingWei?: string;
  isTestnet?: boolean;
}, ownerAddress: string): SearchResultCluster {
  return {
    type: 'cluster',
    name: cluster.name,
    address_hash: ownerAddress,
    is_smart_contract_verified: false,
    cluster_info: {
      cluster_id: cluster.clusterId || cluster.name,
      name: cluster.name,
      owner: cluster.owner,
      created_at: cluster.createdAt,
      expires_at: cluster.expiresAt,
      total_wei_amount: cluster.backingWei,
      is_testnet: cluster.isTestnet,
    },
  };
}

export default function useSearchWithClusters() {
  const quickSearch = useQuickSearchQuery();
  const isClusterQuery = isClusterSearch(quickSearch.debouncedSearchTerm);
  const clusterName = isClusterQuery ? extractClusterName(quickSearch.debouncedSearchTerm) : '';

  const clusterQuery = useApiQuery('clusters:get_cluster_by_name', {
    queryParams: { input: JSON.stringify({ name: clusterName }) },
    queryOptions: {
      queryKey: [ 'clusters:get_cluster_by_name', 'search', clusterName ],
      enabled: config.features.clusters.isEnabled && isClusterQuery && clusterName.length > 0,
      select: (data) => {
        if (!data?.result?.data) return [];
        return [ transformClusterToSearchResult(data.result.data, data.result.data.owner) ];
      },
    },
  });

  const combinedQuery = React.useMemo(() => {
    if (!isClusterQuery) {
      return quickSearch.query;
    }

    return {
      ...clusterQuery,
      data: clusterQuery.data || [],
      isError: false,
    } as typeof quickSearch.query;
  }, [ isClusterQuery, quickSearch, clusterQuery ]);

  const result = React.useMemo(() => ({
    searchTerm: quickSearch.searchTerm,
    debouncedSearchTerm: quickSearch.debouncedSearchTerm,
    handleSearchTermChange: quickSearch.handleSearchTermChange,
    query: combinedQuery,
    redirectCheckQuery: quickSearch.redirectCheckQuery,
  }), [
    quickSearch,
    combinedQuery,
  ]);

  if (!config.features.clusters.isEnabled) {
    return quickSearch;
  }

  return result;
}
