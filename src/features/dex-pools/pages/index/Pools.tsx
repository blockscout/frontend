// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';
import PageTitle from 'src/shell/page/title/PageTitle';

import PoolsList from 'src/features/dex-pools/pages/index/PoolsList';
import PoolsTable from 'src/features/dex-pools/pages/index/PoolsTable';
import { POOL } from 'src/features/dex-pools/stubs';

import config from 'src/config';
import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';
import { useDebouncedFilterChange } from 'src/shared/pagination/useDebouncedFilterChange';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import getQueryParamString from 'src/shared/router/get-query-param-string';

import { FilterInput } from 'src/toolkit/components/filters/FilterInput';

const Pools = () => {
  const poolsQuery = useQueryWithPages({
    resourceName: 'contractInfo:pools',
    pathParams: { instanceId: config.apis.contractInfo?.instanceId },
    options: {
      placeholderData: { items: Array(50).fill(POOL), next_page_params: { page_token: 'a', page_size: 50 } },
    },
  });

  const searchTerm = getQueryParamString(poolsQuery.filters.query);
  const { onFilterChange } = poolsQuery;
  const handleSearchTermChange = useDebouncedFilterChange((value) => onFilterChange({ query: value }));

  const content = poolsQuery.data?.items ? (
    <>
      <Box hideFrom="lg">
        <PoolsList
          items={ poolsQuery.data.items }
          isLoading={ poolsQuery.isInitialLoading }
          resetKey={ poolsQuery.queryHash }
        />
      </Box>
      <Box hideBelow="lg">
        <PoolsTable
          items={ poolsQuery.data.items }
          top={ poolsQuery.pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          isLoading={ poolsQuery.isInitialLoading }
          page={ poolsQuery.pagination.page }
          resetKey={ poolsQuery.queryHash }
        />
      </Box>
    </>
  ) : null;

  const filter = (
    <FilterInput
      w={{ base: '100%', lg: '360px' }}
      size="sm"
      onChange={ handleSearchTermChange }
      placeholder="Pair, token symbol or token address"
      initialValue={ searchTerm }
    />
  );

  const actionBar = (
    <>
      <Flex mb={ 6 } display={{ base: 'flex', lg: 'none' }}>
        { filter }
      </Flex>
      <ActionBar
        mt={ -6 }
        display={{ base: poolsQuery.pagination.isVisible ? 'flex' : 'none', lg: 'flex' }}
      >
        <Box hideBelow="lg">
          { filter }
        </Box>
        <Pagination { ...poolsQuery.pagination } ml="auto"/>
      </ActionBar>
    </>
  );

  return (
    <>
      <PageTitle
        title="DEX tracker"
        withTextAd
      />
      <DataList
        isError={ poolsQuery.isError }
        itemsNum={ poolsQuery.data?.items.length }
        emptyText="There are no pools."
        actionBar={ actionBar }
        hasActiveFilters={ Boolean(searchTerm) }
        emptyStateProps={{
          term: 'pool',
        }}
        isTransitioning={ poolsQuery.isTransitioning }
      >
        { content }
      </DataList>
    </>
  );
};

export default Pools;
