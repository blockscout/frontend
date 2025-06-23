import React from 'react';

import { ClustersOrderBy } from 'types/api/clusters';

import useApiQuery from 'lib/api/useApiQuery';
import { detectInputType } from 'lib/clusters/detectInputType';
import { CLUSTER_ITEM } from 'stubs/clusters';

export function useClustersData(debouncedSearchTerm: string, viewMode: string, orderBy: ClustersOrderBy, page: number) {
  const itemsPerPage = 50;

  const inputType = React.useMemo(() => {
    if (!debouncedSearchTerm) return 'cluster_name';
    return detectInputType(debouncedSearchTerm);
  }, [ debouncedSearchTerm ]);

  const showDirectoryView = viewMode === 'directory' || Boolean(debouncedSearchTerm);

  const leaderboardQuery = useApiQuery('clusters:get_leaderboard', {
    queryParams: {
      input: JSON.stringify({
        offset: (page - 1) * itemsPerPage,
        limit: itemsPerPage,
        orderBy: ClustersOrderBy.RANK_ASC,
      }),
    },
    queryOptions: {
      enabled: !showDirectoryView,
      placeholderData: (previousData) => {
        if (previousData) return previousData;
        return {
          result: {
            data: Array(itemsPerPage).fill(CLUSTER_ITEM),
          },
        };
      },
    },
  });

  const getDirectoryOrderBy = React.useMemo(() => {
    if (debouncedSearchTerm) {
      return ClustersOrderBy.NAME_ASC;
    }
    return ClustersOrderBy.CREATED_AT_DESC;
  }, [ debouncedSearchTerm ]);

  const directoryQuery = useApiQuery('clusters:get_directory', {
    queryParams: {
      input: JSON.stringify({
        offset: (page - 1) * itemsPerPage,
        limit: itemsPerPage,
        orderBy: getDirectoryOrderBy,
        query: debouncedSearchTerm || '',
      }),
    },
    queryOptions: {
      enabled: showDirectoryView && inputType === 'cluster_name',
      placeholderData: (previousData) => {
        if (previousData) return previousData;
        return {
          result: {
            data: {
              total: 1000,
              items: Array(itemsPerPage).fill(CLUSTER_ITEM),
            },
          },
        };
      },
    },
  });

  const addressQuery = useApiQuery('clusters:get_clusters_by_address', {
    queryParams: {
      input: JSON.stringify({
        address: debouncedSearchTerm,
      }),
    },
    queryOptions: {
      enabled: showDirectoryView && inputType === 'address',
      placeholderData: (previousData) => {
        if (previousData) return previousData;
        return {
          result: {
            data: Array(itemsPerPage).fill(CLUSTER_ITEM),
          },
        };
      },
    },
  });

  const currentQuery = React.useMemo(() => {
    if (!showDirectoryView) return leaderboardQuery;
    if (inputType === 'address') return addressQuery;
    return directoryQuery;
  }, [ showDirectoryView, inputType, leaderboardQuery, addressQuery, directoryQuery ]);

  const { data, isError, isPlaceholderData: isLoading } = currentQuery;

  return {
    data,
    isError,
    isLoading,
  };
}
