import React from 'react';

import type { SearchResultCluster } from 'types/api/search';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import useDebounce from 'lib/hooks/useDebounce';

import useQuickSearchQuery from './useQuickSearchQuery';

const CLUSTER_SEARCH_PATTERN = /^(.+)\/$/;

function isClusterSearch(term: string): boolean {
  return CLUSTER_SEARCH_PATTERN.test(term.trim()) && config.features.clusters.isEnabled;
}

function extractClusterName(term: string): string {
  const match = term.match(CLUSTER_SEARCH_PATTERN);
  return match ? match[1] : term;
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
  const debouncedSearchTerm = useDebounce(quickSearch.searchTerm, 300);
  const isClusterQuery = isClusterSearch(debouncedSearchTerm);
  const clusterName = isClusterQuery ? extractClusterName(debouncedSearchTerm) : '';

  const clusterQuery = useApiQuery('clusters:get_cluster_by_name', {
    queryParams: {
      input: JSON.stringify({
        name: clusterName,
      }),
    },
    queryOptions: { enabled: isClusterQuery && clusterName.length > 0 },
  });

  const combinedQuery = React.useMemo(() => {
    if (!isClusterQuery) {
      return quickSearch.query;
    }

    if (clusterQuery.isError || !clusterQuery.data?.result?.data) {
      return {
        ...clusterQuery,
        data: [],
        isError: false,
      } as typeof quickSearch.query;
    }

    const clusterData = clusterQuery.data.result.data;
    const transformedResults = [ transformClusterToSearchResult(clusterData, clusterData.owner) ];

    return {
      ...clusterQuery,
      data: transformedResults,
    } as typeof quickSearch.query;
  }, [ isClusterQuery, quickSearch, clusterQuery ]);

  return React.useMemo(() => ({
    searchTerm: quickSearch.searchTerm,
    debouncedSearchTerm: quickSearch.debouncedSearchTerm,
    handleSearchTermChange: quickSearch.handleSearchTermChange,
    query: combinedQuery,
    redirectCheckQuery: quickSearch.redirectCheckQuery,
  }), [
    quickSearch,
    combinedQuery,
  ]);
}
