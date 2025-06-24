import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

import { detectInputType } from 'lib/clusters/detectInputType';
import {
  getViewModeOrderBy,
  shouldShowDirectoryView,
  transformLeaderboardData,
  transformFullDirectoryData,
  applyDirectoryPagination,
  calculateHasNextPage,
  getCurrentDataLength,
} from 'lib/clusters/pageUtils';
import type { ViewMode } from 'lib/clusters/pageUtils';
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

  const orderBy = getViewModeOrderBy(viewMode, Boolean(debouncedSearchTerm));

  const { data, clusterDetails, isError, isLoading, isClusterDetailsLoading } = useClustersData(debouncedSearchTerm, viewMode, orderBy, page);

  const showDirectoryView = shouldShowDirectoryView(viewMode, Boolean(debouncedSearchTerm));

  const leaderboardData = transformLeaderboardData(data, showDirectoryView);

  const fullDirectoryData = transformFullDirectoryData(data, clusterDetails, inputType, showDirectoryView);

  const limit = 50;

  const directoryData = applyDirectoryPagination(fullDirectoryData, inputType, page, limit);

  const currentDataLength = getCurrentDataLength(showDirectoryView, directoryData.length, leaderboardData.length);

  const hasNextPage = calculateHasNextPage(
    data,
    leaderboardData.length,
    fullDirectoryData.length,
    showDirectoryView,
    inputType,
    page,
    Boolean(debouncedSearchTerm),
    limit,
  );

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
        itemsNum={ currentDataLength }
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
