import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

import { ClustersOrderBy } from 'types/api/clusters';
import type { ClustersLeaderboardObject, ClustersDirectoryObject, ClustersByAddressObject } from 'types/api/clusters';

import { detectInputType } from 'lib/clusters/detectInputType';
import { useClusterPagination } from 'lib/hooks/useClusterPagination';
import { useClustersData } from 'lib/hooks/useClustersData';
import { useClusterSearch } from 'lib/hooks/useClusterSearch';
import { useQueryParams } from 'lib/hooks/useQueryParams';
import getQueryParamString from 'lib/router/getQueryParamString';
import { apos } from 'toolkit/utils/htmlEntities';
import ClustersActionBar from 'ui/clusters/ClustersActionBar';
import ClustersDirectoryListItem from 'ui/clusters/ClustersDirectoryListItem';
import ClustersDirectoryTable from 'ui/clusters/ClustersDirectoryTable';
import ClustersLeaderboardListItem from 'ui/clusters/ClustersLeaderboardListItem';
import ClustersLeaderboardTable from 'ui/clusters/ClustersLeaderboardTable';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';

type ViewMode = 'leaderboard' | 'directory';

const Clusters = () => {
  const router = useRouter();
  const { updateQuery } = useQueryParams();

  const { searchTerm, debouncedSearchTerm } = useClusterSearch();
  const viewMode = (getQueryParamString(router.query.view) as ViewMode) || 'leaderboard';
  const page = parseInt(getQueryParamString(router.query.page) || '1', 10);

  const inputType = React.useMemo(() => {
    if (!debouncedSearchTerm) return 'cluster_name';
    return detectInputType(debouncedSearchTerm);
  }, [ debouncedSearchTerm ]);

  const orderBy = React.useMemo(() => {
    if (viewMode === 'leaderboard') return ClustersOrderBy.RANK_ASC;
    if (debouncedSearchTerm) return ClustersOrderBy.NAME_ASC;
    return ClustersOrderBy.CREATED_AT_DESC;
  }, [ viewMode, debouncedSearchTerm ]);

  const { data, clusterDetails, isError, isLoading, isClusterDetailsLoading } = useClustersData(debouncedSearchTerm, viewMode, orderBy, page);

  const showDirectoryView = viewMode === 'directory' || Boolean(debouncedSearchTerm);

  const leaderboardData = React.useMemo(() => {
    if (!data || showDirectoryView) return [];
    if (data?.result?.data && Array.isArray(data.result.data)) {
      return data.result.data as Array<ClustersLeaderboardObject>;
    }
    return [];
  }, [ data, showDirectoryView ]);

  const fullDirectoryData: Array<ClustersDirectoryObject> = React.useMemo(() => {
    if (!showDirectoryView || !data) return [];

    if (inputType === 'address') {
      const addressData = data?.result?.data as Array<ClustersByAddressObject>;
      if (addressData && Array.isArray(addressData)) {
        const clusterDetailsData = clusterDetails?.result?.data;
        const allChainIds = clusterDetailsData?.wallets?.flatMap(
          (wallet: { chainIds: Array<string> }) => wallet.chainIds,
        ) || [];
        const uniqueChainIds = [ ...new Set(allChainIds) ] as Array<string>;
        return addressData.map((item) => ({
          name: item.name,
          isTestnet: item.isTestnet,
          createdAt: item.createdAt,
          owner: item.owner,
          totalWeiAmount: item.totalWeiAmount,
          updatedAt: item.updatedAt,
          updatedBy: item.updatedBy,
          chainIds: uniqueChainIds,
        }));
      }
    } else {
      const apiData = data?.result?.data;
      if (apiData && typeof apiData === 'object' && 'items' in apiData && Array.isArray(apiData.items)) {
        return apiData.items as Array<ClustersDirectoryObject>;
      }
    }

    return [];
  }, [ data, clusterDetails, showDirectoryView, inputType ]);

  const limit = 50;

  const directoryData = React.useMemo(() => {
    if (inputType === 'address') {
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      return fullDirectoryData.slice(startIndex, endIndex);
    }
    return fullDirectoryData;
  }, [ fullDirectoryData, inputType, page, limit ]);

  const currentData = showDirectoryView ? directoryData : leaderboardData;

  const hasNextPage = React.useMemo(() => {
    if (showDirectoryView) {
      if (inputType === 'address') {
        return page * limit < fullDirectoryData.length;
      } else {
        if (debouncedSearchTerm) return false;
        const apiData = data?.result?.data;
        if (apiData && typeof apiData === 'object' && 'total' in apiData) {
          return (page * limit) < apiData.total;
        }
        return false;
      }
    }
    return leaderboardData.length === limit;
  }, [ data, leaderboardData.length, fullDirectoryData.length, limit, page, showDirectoryView, inputType, debouncedSearchTerm ]);

  const { pagination } = useClusterPagination(hasNextPage, isLoading);

  const handleViewModeChange = useCallback((newViewMode: ViewMode) => {
    updateQuery({
      view: newViewMode === 'leaderboard' ? undefined : newViewMode,
      page: undefined,
    });
  }, [ updateQuery ]);

  const handleSearchChange = useCallback((value: string) => {
    updateQuery({
      q: value || undefined,
      page: undefined,
    });
  }, [ updateQuery ]);

  const hasActiveFilters = Boolean(debouncedSearchTerm);

  const content = (
    <>
      <Box hideFrom="lg">
        { showDirectoryView ? (
          directoryData.map((item, index) => (
            <ClustersDirectoryListItem
              key={ `${ item.name }-${ index }${ isLoading ? '-loading' : '' }` }
              item={ item }
              isLoading={ isLoading }
              isClusterDetailsLoading={ isClusterDetailsLoading && inputType === 'address' }
            />
          ))
        ) : (
          leaderboardData.map((item, index) => (
            <ClustersLeaderboardListItem
              key={ `${ item.name }-${ index }${ isLoading ? '-loading' : '' }` }
              item={ item }
              isLoading={ isLoading }
            />
          ))
        ) }
      </Box>
      <Box hideBelow="lg">
        { showDirectoryView ? (
          <ClustersDirectoryTable
            data={ directoryData }
            isLoading={ isLoading }
            isClusterDetailsLoading={ isClusterDetailsLoading && inputType === 'address' }
            top={ 80 }
          />
        ) : (
          <ClustersLeaderboardTable
            data={ leaderboardData }
            isLoading={ isLoading }
            top={ 80 }
          />
        ) }
      </Box>
    </>
  );

  const actionBar = (
    <ClustersActionBar
      isLoading={ isLoading }
      searchTerm={ searchTerm }
      onSearchChange={ handleSearchChange }
      viewMode={ viewMode }
      onViewModeChange={ handleViewModeChange }
      pagination={ pagination }
    />
  );

  return (
    <>
      <PageTitle title="Clusters lookup"/>
      <DataListDisplay
        isError={ isError }
        itemsNum={ currentData.length }
        filterProps={{
          emptyFilteredText: `Couldn${ apos }t find clusters that match your query.`,
          hasActiveFilters,
        }}
        actionBar={ actionBar }
      >
        { content }
      </DataListDisplay>
    </>
  );
};

export default Clusters;
