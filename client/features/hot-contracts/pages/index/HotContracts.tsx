// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, createListCollection, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { HotContractsInterval, HotContractsSorting, HotContractsSortingField, HotContractsSortingValue } from 'client/features/hot-contracts/types/api';

import useApiQuery from 'client/api/hooks/useApiQuery';

import ActionBar from 'client/shell/page/action-bar/ActionBar';
import PageTitle from 'client/shell/page/title/PageTitle';

import { HOMEPAGE_STATS } from 'client/slices/home/stubs';

import HotContractsIntervalSelect from 'client/features/hot-contracts/pages/index/HotContractsIntervalSelect';
import HotContractsListItem from 'client/features/hot-contracts/pages/index/HotContractsListItem';
import HotContractsTable from 'client/features/hot-contracts/pages/index/HotContractsTable';
import { HOT_CONTRACTS } from 'client/features/hot-contracts/stubs';
import { getIntervalValueFromQuery, SORT_OPTIONS } from 'client/features/hot-contracts/utils';

import DataList from 'client/shared/lists/DataList';
import Pagination from 'client/shared/pagination/Pagination';
import useQueryWithPages from 'client/shared/pagination/useQueryWithPages';
import getSortParamsFromValue from 'client/shared/sort/get-sort-params-from-value';
import getSortValueFromQuery from 'client/shared/sort/get-sort-value-from-query';
import Sort from 'client/shared/sort/Sort';

import { Skeleton } from 'toolkit/chakra/skeleton';

const sortCollection = createListCollection({
  items: SORT_OPTIONS,
});

const HotContracts = () => {
  const router = useRouter();
  const [ interval, setInterval ] = React.useState<HotContractsInterval>(getIntervalValueFromQuery(router.query.scale));
  const [ sort, setSort ] =
      React.useState<HotContractsSortingValue>(getSortValueFromQuery<HotContractsSortingValue>(router.query, SORT_OPTIONS) ?? 'default');

  const { data, isError, isPlaceholderData, pagination, onSortingChange, onFilterChange } = useQueryWithPages({
    resourceName: 'general:stats_hot_contracts',
    filters: { scale: interval },
    sorting: getSortParamsFromValue<HotContractsSortingValue, HotContractsSortingField, HotContractsSorting['order']>(sort),
    options: {
      placeholderData: {
        items: Array(50).fill(HOT_CONTRACTS),
        next_page_params: { items_count: '50', transactions_count: '50', total_gas_used: '50', contract_address_hash: '50' },
      },
    },
  });

  const statsQuery = useApiQuery('general:stats', {
    queryOptions: {
      placeholderData: HOMEPAGE_STATS,
      refetchOnMount: false,
    },
  });

  const handleSortChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setSort(value[0] as HotContractsSortingValue);
    onSortingChange(value[0] === 'default' ? undefined : getSortParamsFromValue(value[0] as HotContractsSortingValue));
  }, [ onSortingChange ]);

  const handleIntervalChange = React.useCallback((newInterval: HotContractsInterval) => {
    setInterval(newInterval);
    onFilterChange({ scale: newInterval });
  }, [ onFilterChange ]);

  const content = (
    <>
      <Box hideFrom="lg">
        { data?.items.map((item, index) => (
          <HotContractsListItem
            key={ item.contract_address.hash + (isPlaceholderData ? index : '') }
            isLoading={ isPlaceholderData }
            data={ item }
            exchangeRate={ statsQuery.data?.coin_price ?? null }
          />
        )) }
      </Box>
      <Box hideBelow="lg">
        <HotContractsTable
          items={ data?.items }
          isLoading={ isPlaceholderData }
          sort={ sort }
          setSorting={ handleSortChange }
          exchangeRate={ statsQuery.data?.coin_price ?? null }
        />
      </Box>
    </>
  );

  const actionBar = (
    <ActionBar mt={ -6 }>
      <Flex alignItems="center">
        <HotContractsIntervalSelect
          interval={ interval }
          onIntervalChange={ handleIntervalChange }
          isLoading={ isPlaceholderData }
        />
        { [ '1d', '7d', '30d' ].includes(interval) && (
          <Skeleton loading={ isPlaceholderData } color="text.secondary" hideBelow="lg" textStyle="sm" ml={ 6 }>
            <span>The data is updated once a day.</span>
          </Skeleton>
        ) }
        <Sort
          name="hot_contracts_sorting"
          defaultValue={ [ sort ] }
          collection={ sortCollection }
          onValueChange={ handleSortChange }
          isLoading={ isPlaceholderData }
          hideFrom="lg"
          ml={ 2 }
        />
      </Flex>
      <Pagination { ...pagination } ml="auto"/>
    </ActionBar>
  );

  return (
    <>
      <PageTitle
        title="Hot contracts"
        withTextAd
      />
      <DataList
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no hot contracts."
        actionBar={ actionBar }
        hasActiveFilters={ Boolean(interval) }
        emptyStateProps={{
          term: 'hot contract',
        }}
      >
        { content }
      </DataList>
    </>
  );
};

export default HotContracts;
