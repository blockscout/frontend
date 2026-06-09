// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';
import PageTitle from 'src/shell/page/title/PageTitle';

import PoolsListItem from 'src/features/dex-pools/pages/index/PoolsListItem';
import PoolsTable from 'src/features/dex-pools/pages/index/PoolsTable';
import { POOL } from 'src/features/dex-pools/stubs';

import config from 'src/config';
import useDebounce from 'src/shared/hooks/useDebounce';
import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import getQueryParamString from 'src/shared/router/get-query-param-string';

import { FilterInput } from 'src/toolkit/components/filters/FilterInput';

const Pools = () => {
  const router = useRouter();
  const q = getQueryParamString(router.query.query);

  const [ searchTerm, setSearchTerm ] = React.useState<string>(q ?? '');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const poolsQuery = useQueryWithPages({
    resourceName: 'contractInfo:pools',
    pathParams: { instanceId: config.apis.contractInfo?.instanceId },
    filters: { query: debouncedSearchTerm },
    options: {
      placeholderData: { items: Array(50).fill(POOL), next_page_params: { page_token: 'a', page_size: 50 } },
    },
  });

  const handleSearchTermChange = React.useCallback((value: string) => {
    poolsQuery.onFilterChange({ query: value });
    setSearchTerm(value);
  }, [ poolsQuery ]);

  const content = (
    <>
      <Box hideFrom="lg">
        { poolsQuery.data?.items.map((item, index) => (
          <PoolsListItem
            key={ item.pool_id + (poolsQuery.isPlaceholderData ? index : '') }
            isLoading={ poolsQuery.isPlaceholderData }
            item={ item }
          />
        )) }
      </Box>
      <Box hideBelow="lg">
        <PoolsTable
          items={ poolsQuery.data?.items ?? [] }
          top={ poolsQuery.pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          isLoading={ poolsQuery.isPlaceholderData }
          page={ poolsQuery.pagination.page }
        />
      </Box>
    </>
  );

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
        hasActiveFilters={ Boolean(debouncedSearchTerm) }
        emptyStateProps={{
          term: 'pool',
        }}
      >
        { content }
      </DataList>
    </>
  );
};

export default Pools;
