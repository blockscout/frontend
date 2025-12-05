import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { HotContractsSorting, HotContractsSortingField, HotContractsSortingValue } from 'types/api/contracts';

import getQueryParamString from 'lib/router/getQueryParamString';
import { HOT_CONTRACTS } from 'stubs/contract';
import { apos } from 'toolkit/utils/htmlEntities';
import HotContractsListItem from 'ui/hotContracts/HotContractsListItem';
import HotContractsTable from 'ui/hotContracts/HotContractsTable';
import { SORT_OPTIONS } from 'ui/hotContracts/utils';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import getSortParamsFromValue from 'ui/shared/sort/getSortParamsFromValue';
import getSortValueFromQuery from 'ui/shared/sort/getSortValueFromQuery';

const HotContracts = () => {
  const router = useRouter();
  const scale = getQueryParamString(router.query.scale) || '5m';
  const [ sort, setSort ] =
      React.useState<HotContractsSortingValue>(getSortValueFromQuery<HotContractsSortingValue>(router.query, SORT_OPTIONS) ?? 'default');

  const { data, isError, isPlaceholderData, pagination, onSortingChange } = useQueryWithPages({
    resourceName: 'general:stats_hot_contracts',
    filters: { scale },
    sorting: getSortParamsFromValue<HotContractsSortingValue, HotContractsSortingField, HotContractsSorting['order']>(sort),
    options: {
      placeholderData: {
        items: Array(50).fill(HOT_CONTRACTS),
        next_page_params: { items_count: '50', transactions_count: '50', total_gas_used: '50', contract_address_hash: '50' },
      },
    },
  });

  const handleSortChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setSort(value[0] as HotContractsSortingValue);
    onSortingChange(value[0] === 'default' ? undefined : getSortParamsFromValue(value[0] as HotContractsSortingValue));
  }, [ onSortingChange ]);

  const content = (
    <>
      <Box hideFrom="lg">
        { data?.items.map((item, index) => (
          <HotContractsListItem
            key={ item.contract_address.hash + (isPlaceholderData ? index : '') }
            isLoading={ isPlaceholderData }
            data={ item }
          />
        )) }
      </Box>
      <Box hideBelow="lg">
        <HotContractsTable
          items={ data?.items ?? [] }
          isLoading={ isPlaceholderData }
          sort={ sort }
          setSorting={ handleSortChange }
        />
      </Box>
    </>
  );

  const actionBar = (
    <ActionBar mt={ -6 }>
      <Box>
        PERIOD FILTER
      </Box>
      <Pagination { ...pagination } ml="auto"/>
    </ActionBar>
  );

  return (
    <>
      <PageTitle
        title="Hot contracts"
        withTextAd
      />
      <DataListDisplay
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no pools."
        actionBar={ actionBar }
        filterProps={{
          emptyFilteredText: `Couldn${ apos }t find hot contracts that matches your filter query.`,
          hasActiveFilters: Boolean(scale),
        }}
      >
        { content }
      </DataListDisplay>
    </>
  );
};

export default HotContracts;
