// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { InternalTransaction } from 'client/slices/internal-tx/types/api';

import { INTERNAL_TX } from 'client/slices/internal-tx/stubs';
import TxPendingAlert from 'client/slices/tx/components/TxPendingAlert';
import TxSocketAlert from 'client/slices/tx/components/TxSocketAlert';
import type { TxQuery } from 'client/slices/tx/hooks/useTxQuery';

import compareBns from 'lib/bigint/compareBns';
// import { apos } from 'toolkit/utils/htmlEntities';
import { generateListStub } from 'stubs/utils';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
// import { FilterInput } from 'toolkit/components/filters/FilterInput';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import { default as getNextSortValueShared } from 'ui/shared/sort/getNextSortValue';

import type { Sort, SortField } from '../../utils/utils';
import TxInternalsList from './TxInternalsList';
import TxInternalsTable from './TxInternalsTable';

const SORT_SEQUENCE: Record<SortField, Array<Sort>> = {
  value: [ 'value-desc', 'value-asc', 'default' ],
  'gas-limit': [ 'gas-limit-desc', 'gas-limit-asc', 'default' ],
};

const getNextSortValue = (getNextSortValueShared<SortField, Sort>).bind(undefined, SORT_SEQUENCE);

const sortFn = (sort: Sort) => (a: InternalTransaction, b: InternalTransaction) => {
  switch (sort) {
    case 'value-desc': {
      return compareBns(b.value, a.value);
    }

    case 'value-asc': {
      return compareBns(a.value, b.value);
    }

    case 'gas-limit-desc': {
      return compareBns(b.gas_limit, a.gas_limit);
    }

    case 'gas-limit-asc': {
      return compareBns(a.gas_limit, b.gas_limit);

    }

    default:
      return 0;
  }
};

// const searchFn = (searchTerm: string) => (item: InternalTransaction): boolean => {
//   const formattedSearchTerm = searchTerm.toLowerCase();
//   return item.type.toLowerCase().includes(formattedSearchTerm) ||
//     item.from.hash.toLowerCase().includes(formattedSearchTerm) ||
//     item.to.hash.toLowerCase().includes(formattedSearchTerm);
// };

interface Props {
  txQuery: TxQuery;
}

const TxInternals = ({ txQuery }: Props) => {
  // filters are not implemented yet in api
  // const [ filters, setFilters ] = React.useState<Array<TxInternalsType>>([]);
  // const [ searchTerm, setSearchTerm ] = React.useState<string>('');
  const [ sort, setSort ] = React.useState<Sort>('default');
  const { data, isPlaceholderData, isError, pagination } = useQueryWithPages({
    resourceName: 'general:tx_internal_txs',
    pathParams: { hash: txQuery.data?.hash },
    options: {
      enabled: !txQuery.isPlaceholderData && Boolean(txQuery.data?.hash) && Boolean(txQuery.data?.status),
      placeholderData: generateListStub<'general:tx_internal_txs'>(INTERNAL_TX, 3, { next_page_params: null }),
    },
  });

  // const handleFilterChange = React.useCallback((nextValue: Array<TxInternalsType>) => {
  //   setFilters(nextValue);
  // }, []);

  const handleSortToggle = React.useCallback((field: SortField) => {
    if (isPlaceholderData) {
      return;
    }

    setSort(getNextSortValue(field));
  }, [ isPlaceholderData ]);

  if (!txQuery.isPlaceholderData && !txQuery.isError && !txQuery.data?.status) {
    return txQuery.socketStatus ? <TxSocketAlert status={ txQuery.socketStatus }/> : <TxPendingAlert/>;
  }

  const filteredData = data?.items
    .slice()
  // .filter(({ type }) => filters.length > 0 ? filters.includes(type) : true)
  // .filter(searchFn(searchTerm))
    .sort(sortFn(sort));

  const content = filteredData ? (
    <>
      <Box hideFrom="lg"><TxInternalsList data={ filteredData } isLoading={ isPlaceholderData }/></Box>
      <Box hideBelow="lg">
        <TxInternalsTable
          data={ filteredData }
          sort={ sort }
          onSortToggle={ handleSortToggle }
          top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          isLoading={ isPlaceholderData }
        />
      </Box>
    </>
  ) : null;

  const actionBar = pagination.isVisible ? (
    <ActionBar mt={ -6 }>
      { /* <FilterInput onChange={ setSearchTerm } maxW="360px" ml={ 3 } size="xs" placeholder="Search by addresses, hash, method..."/> */ }
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  ) : null;

  return (
    <DataListDisplay
      isError={ isError || txQuery.isError }
      itemsNum={ data?.items.length }
      emptyText="There are no internal transactions for this transaction."
      // filterProps={{
      // emptyFilteredText: `Couldn${ apos }t find any transaction that matches your query.`.
      // hasActiveFilters: Boolean(filters.length || searchTerm),
      // }}
      actionBar={ actionBar }
    >
      { content }
    </DataListDisplay>
  );
};

export default TxInternals;
