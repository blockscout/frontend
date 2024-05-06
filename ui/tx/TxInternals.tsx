import { Show, Hide } from '@chakra-ui/react';
import React from 'react';

import type { InternalTransaction } from 'types/api/internalTransaction';

// import { apos } from 'lib/html-entities';
import { INTERNAL_TX } from 'stubs/internalTx';
import { generateListStub } from 'stubs/utils';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
// import FilterInput from 'ui/shared/filters/FilterInput';
// import TxInternalsFilter from 'ui/tx/internals/TxInternalsFilter';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import { default as getNextSortValueShared } from 'ui/shared/sort/getNextSortValue';
import TxInternalsList from 'ui/tx/internals/TxInternalsList';
import TxInternalsTable from 'ui/tx/internals/TxInternalsTable';
import type { Sort, SortField } from 'ui/tx/internals/utils';
import TxPendingAlert from 'ui/tx/TxPendingAlert';
import TxSocketAlert from 'ui/tx/TxSocketAlert';

import type { TxQuery } from './useTxQuery';

const SORT_SEQUENCE: Record<SortField, Array<Sort | undefined>> = {
  value: [ 'value-desc', 'value-asc', undefined ],
  'gas-limit': [ 'gas-limit-desc', 'gas-limit-asc', undefined ],
};

const getNextSortValue = (getNextSortValueShared<SortField, Sort>).bind(undefined, SORT_SEQUENCE);

const sortFn = (sort: Sort | undefined) => (a: InternalTransaction, b: InternalTransaction) => {
  switch (sort) {
    case 'value-desc': {
      const result = a.value > b.value ? -1 : 1;
      return a.value === b.value ? 0 : result;
    }

    case 'value-asc': {
      const result = a.value > b.value ? 1 : -1;
      return a.value === b.value ? 0 : result;
    }

    case 'gas-limit-desc': {
      const result = a.gas_limit > b.gas_limit ? -1 : 1;
      return a.gas_limit === b.gas_limit ? 0 : result;
    }

    case 'gas-limit-asc': {
      const result = a.gas_limit > b.gas_limit ? 1 : -1;
      return a.gas_limit === b.gas_limit ? 0 : result;
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
  const [ sort, setSort ] = React.useState<Sort>();
  const { data, isPlaceholderData, isError, pagination } = useQueryWithPages({
    resourceName: 'tx_internal_txs',
    pathParams: { hash: txQuery.data?.hash },
    options: {
      enabled: !txQuery.isPlaceholderData && Boolean(txQuery.data?.hash) && Boolean(txQuery.data?.status),
      placeholderData: generateListStub<'tx_internal_txs'>(INTERNAL_TX, 3, { next_page_params: null }),
    },
  });

  // const handleFilterChange = React.useCallback((nextValue: Array<TxInternalsType>) => {
  //   setFilters(nextValue);
  // }, []);

  const handleSortToggle = React.useCallback((field: SortField) => {
    return () => {
      if (isPlaceholderData) {
        return;
      }
      setSort(getNextSortValue(field));
    };
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
      <Show below="lg" ssr={ false }><TxInternalsList data={ filteredData } isLoading={ isPlaceholderData }/></Show>
      <Hide below="lg" ssr={ false }>
        <TxInternalsTable
          data={ filteredData }
          sort={ sort }
          onSortToggle={ handleSortToggle }
          top={ pagination.isVisible ? 80 : 0 }
          isLoading={ isPlaceholderData }
        />
      </Hide>
    </>
  ) : null;

  const actionBar = pagination.isVisible ? (
    <ActionBar mt={ -6 }>
      { /* <TxInternalsFilter onFilterChange={ handleFilterChange } defaultFilters={ filters } appliedFiltersNum={ filters.length }/> */ }
      { /* <FilterInput onChange={ setSearchTerm } maxW="360px" ml={ 3 } size="xs" placeholder="Search by addresses, hash, method..."/> */ }
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  ) : null;

  return (
    <DataListDisplay
      isError={ isError || txQuery.isError }
      items={ data?.items }
      emptyText="There are no internal transactions for this transaction."
      // filterProps={{
      // emptyFilteredText: `Couldn${ apos }t find any transaction that matches your query.`.
      // hasActiveFilters: Boolean(filters.length || searchTerm),
      // }}
      content={ content }
      actionBar={ actionBar }
    />
  );
};

export default TxInternals;
