import { Show, Hide, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import config from 'configs/app';
import useDebounce from 'lib/hooks/useDebounce';
import { apos } from 'lib/html-entities';
import getQueryParamString from 'lib/router/getQueryParamString';
import { POOL } from 'stubs/pools';
import PoolsListItem from 'ui/pools/PoolsListItem';
import PoolsTable from 'ui/pools/PoolsTable';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import FilterInput from 'ui/shared/filters/FilterInput';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

const Pools = () => {
  const router = useRouter();
  const q = getQueryParamString(router.query.query);

  const [ searchTerm, setSearchTerm ] = React.useState<string>(q ?? '');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const poolsQuery = useQueryWithPages({
    resourceName: 'pools',
    pathParams: { chainId: config.chain.id },
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
      <Show below="lg" ssr={ false }>
        { poolsQuery.data?.items.map((item, index) => (
          <PoolsListItem
            key={ item.contract_address + (poolsQuery.isPlaceholderData ? index : '') }
            isLoading={ poolsQuery.isPlaceholderData }
            item={ item }
          />
        )) }
      </Show>
      <Hide below="lg" ssr={ false }>
        <PoolsTable
          items={ poolsQuery.data?.items ?? [] }
          top={ poolsQuery.pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          isLoading={ poolsQuery.isPlaceholderData }
          page={ poolsQuery.pagination.page }
        />
      </Hide>
    </>
  );

  const filter = (
    <FilterInput
      w={{ base: '100%', lg: '360px' }}
      size="xs"
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
        <Hide below="lg">
          { filter }
        </Hide>
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
      <DataListDisplay
        isError={ poolsQuery.isError }
        items={ poolsQuery.data?.items }
        emptyText="There are no pools."
        content={ content }
        actionBar={ actionBar }
        filterProps={{
          emptyFilteredText: `Couldn${ apos }t find pools that matches your filter query.`,
          hasActiveFilters: Boolean(debouncedSearchTerm),
        }}
      />
    </>
  );
};

export default Pools;
