import { Box, Flex, Alert, Show } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { InternalTransactionsResponse, TxInternalsType, InternalTransaction } from 'types/api/internalTransaction';
import { QueryKeys } from 'types/client/queries';

import useFetch from 'lib/hooks/useFetch';
import useIsMobile from 'lib/hooks/useIsMobile';
import { apos } from 'lib/html-entities';
import EmptySearchResult from 'ui/apps/EmptySearchResult';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import FilterInput from 'ui/shared/FilterInput';
import TxInternalsFilter from 'ui/tx/internals/TxInternalsFilter';
import TxInternalsList from 'ui/tx/internals/TxInternalsList';
import TxInternalsSkeletonDesktop from 'ui/tx/internals/TxInternalsSkeletonDesktop';
import TxInternalsSkeletonMobile from 'ui/tx/internals/TxInternalsSkeletonMobile';
import TxInternalsTable from 'ui/tx/internals/TxInternalsTable';
import type { Sort, SortField } from 'ui/tx/internals/utils';

const SORT_SEQUENCE: Record<SortField, Array<Sort | undefined>> = {
  value: [ 'value-desc', 'value-asc', undefined ],
  'gas-limit': [ 'gas-limit-desc', 'gas-limit-asc', undefined ],
};

const getNextSortValue = (field: SortField) => (prevValue: Sort | undefined) => {
  const sequence = SORT_SEQUENCE[field];
  const curIndex = sequence.findIndex((sort) => sort === prevValue);
  const nextIndex = curIndex + 1 > sequence.length - 1 ? 0 : curIndex + 1;
  return sequence[nextIndex];
};

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

const searchFn = (searchTerm: string) => (item: InternalTransaction): boolean => {
  const formattedSearchTerm = searchTerm.toLowerCase();
  return item.type.toLowerCase().includes(formattedSearchTerm) ||
    item.from.hash.toLowerCase().includes(formattedSearchTerm) ||
    item.to.hash.toLowerCase().includes(formattedSearchTerm);
};

const TxInternals = () => {
  const router = useRouter();
  const fetch = useFetch();

  const [ filters, setFilters ] = React.useState<Array<TxInternalsType>>([]);
  const [ searchTerm, setSearchTerm ] = React.useState<string>('');
  const [ sort, setSort ] = React.useState<Sort>();
  const { data, isLoading, isError } = useQuery<unknown, unknown, InternalTransactionsResponse>(
    [ QueryKeys.txInternals, router.query.id ],
    async() => await fetch(`/node-api/transactions/${ router.query.id }/internal-transactions`),
    {
      enabled: Boolean(router.query.id),
    },
  );

  const isMobile = useIsMobile();

  const handleFilterChange = React.useCallback((nextValue: Array<TxInternalsType>) => {
    setFilters(nextValue);
  }, []);

  const handleSortToggle = React.useCallback((field: SortField) => {
    return () => {
      setSort(getNextSortValue(field));
    };
  }, []);

  if (isLoading) {
    return (
      <>
        <Show below="lg"><TxInternalsSkeletonMobile/></Show>
        <Show above="lg"><TxInternalsSkeletonDesktop/></Show>
      </>
    );
  }

  if (isError) {
    return <DataFetchAlert/>;
  }

  if (data.items.length === 0) {
    return <Alert>There are no internal transactions for this transaction.</Alert>;
  }

  const content = (() => {
    const filteredData = data.items
      .filter(({ type }) => filters.length > 0 ? filters.includes(type) : true)
      .filter(searchFn(searchTerm))
      .sort(sortFn(sort));

    if (filteredData.length === 0) {
      return <EmptySearchResult text={ `Couldn${ apos }t find any transaction that matches your query.` }/>;
    }

    return isMobile ?
      <TxInternalsList data={ filteredData }/> :
      <TxInternalsTable data={ filteredData } sort={ sort } onSortToggle={ handleSortToggle }/>;
  })();

  return (
    <Box>
      <Flex mb={ 6 }>
        <TxInternalsFilter onFilterChange={ handleFilterChange } defaultFilters={ filters } appliedFiltersNum={ filters.length }/>
        <FilterInput onChange={ setSearchTerm } maxW="360px" ml={ 3 } size="xs" placeholder="Search by addresses, hash, method..."/>
      </Flex>
      { content }
    </Box>
  );
};

export default TxInternals;
