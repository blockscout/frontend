// SPDX-License-Identifier: LicenseRef-Blockscout

import { createListCollection } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import { INTERNAL_TX } from 'src/slices/internal-tx/stubs';
import TxPendingAlert from 'src/slices/tx/components/TxPendingAlert';
import TxSocketAlert from 'src/slices/tx/components/TxSocketAlert';
import type { TxQuery } from 'src/slices/tx/hooks/useTxQuery';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import DataList from 'src/shared/lists/DataList';
import compareBns from 'src/shared/numbers/compareBns';
import Pagination from 'src/shared/pagination/Pagination';
import useApiPaginatedQuery from 'src/shared/pagination/useApiPaginatedQuery';
import { generateListStub } from 'src/shared/pagination/utils';
import { default as getNextSortValueShared } from 'src/shared/sort/get-next-sort-value';
import Sort from 'src/shared/sort/Sort';

import { TableContainerScrollable } from 'src/toolkit/chakra/table';

import type { Sort as SortValue, SortField } from '../../utils/utils';
import { SORT_OPTIONS, SORT_SEQUENCE } from './sort';
import TxInternalsTable from './TxInternalsTable';

const sortCollection = createListCollection({
  items: SORT_OPTIONS,
});

const getNextSortValue = (getNextSortValueShared<SortField, SortValue>).bind(undefined, SORT_SEQUENCE);

const sortFn = (sort: SortValue) => (a: schemas['InternalTransaction'], b: schemas['InternalTransaction']) => {
  switch (sort) {
    case 'value-desc': {
      return compareBns(b.value, a.value);
    }

    case 'value-asc': {
      return compareBns(a.value, b.value);
    }

    case 'gas-limit-desc': {
      return compareBns(b.gas_limit || '0', a.gas_limit || '0');
    }

    case 'gas-limit-asc': {
      return compareBns(a.gas_limit || '0', b.gas_limit || '0');

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
  const isMobile = useIsMobile();
  const [ sort, setSort ] = React.useState<SortValue>('default');
  const { data, isInitialLoading, isTransitioning, isError, pagination, queryHash } = useApiPaginatedQuery({
    resourceName: 'core:tx_internal_txs',
    pathParams: { hash: txQuery.data?.hash },
    options: {
      enabled: !txQuery.isPlaceholderData && Boolean(txQuery.data?.hash) && Boolean(txQuery.data?.status),
      placeholderData: generateListStub<'core:tx_internal_txs'>(INTERNAL_TX, 3, { next_page_params: null, meta: { message: null, status: 1 } }),
    },
  });

  // const handleFilterChange = React.useCallback((nextValue: Array<TxInternalsType>) => {
  //   setFilters(nextValue);
  // }, []);

  const handleSortToggle = React.useCallback((field: SortField) => {
    if (isInitialLoading) {
      return;
    }

    setSort(getNextSortValue(field));
  }, [ isInitialLoading ]);

  const handleSortValueChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setSort(value[0] as SortValue);
  }, []);

  if (!txQuery.isPlaceholderData && !txQuery.isError && !txQuery.data?.status) {
    return txQuery.socketStatus ? <TxSocketAlert status={ txQuery.socketStatus }/> : <TxPendingAlert/>;
  }

  const filteredData = data?.items
    .slice()
  // .filter(({ type }) => filters.length > 0 ? filters.includes(type) : true)
  // .filter(searchFn(searchTerm))
    .sort(sortFn(sort));

  const content = filteredData ? (
    <TableContainerScrollable>
      <TxInternalsTable
        data={ filteredData }
        sort={ sort }
        onSortToggle={ handleSortToggle }
        top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
        isLoading={ isInitialLoading }
        resetKey={ queryHash }
      />
    </TableContainerScrollable>
  ) : null;

  const actionBar = (isMobile || pagination.isVisible) ? (
    <ActionBar mt={ -6 }>
      { /* <FilterInput onChange={ setSearchTerm } maxW="360px" ml={ 3 } size="xs" placeholder="Search by addresses, hash, method..."/> */ }
      <Sort
        name="tx_internal_txs_sorting"
        defaultValue={ [ sort ] }
        collection={ sortCollection }
        onValueChange={ handleSortValueChange }
        isLoading={ isInitialLoading }
        hideFrom="lg"
      />
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  ) : null;

  return (
    <DataList
      isError={ isError || txQuery.isError }
      itemsNum={ data?.items.length }
      emptyText="There are no internal transactions for this transaction."
      // filterProps={{
      // emptyFilteredText: `Couldn${ apos }t find any transaction that matches your query.`.
      // hasActiveFilters: Boolean(filters.length || searchTerm),
      // }}
      actionBar={ actionBar }
      isTransitioning={ isTransitioning }
    >
      { content }
    </DataList>
  );
};

export default TxInternals;
