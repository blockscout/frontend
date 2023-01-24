import { Box, Text, Show, Hide } from '@chakra-ui/react';
import React from 'react';

import type { InternalTransaction } from 'types/api/internalTransaction';

import { SECOND } from 'lib/consts';
import useIsMobile from 'lib/hooks/useIsMobile';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import { apos } from 'lib/html-entities';
import EmptySearchResult from 'ui/apps/EmptySearchResult';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
// import FilterInput from 'ui/shared/filters/FilterInput';
// import TxInternalsFilter from 'ui/tx/internals/TxInternalsFilter';
import Pagination from 'ui/shared/Pagination';
import SkeletonList from 'ui/shared/skeletons/SkeletonList';
import SkeletonTable from 'ui/shared/skeletons/SkeletonTable';
import TxInternalsList from 'ui/tx/internals/TxInternalsList';
import TxInternalsTable from 'ui/tx/internals/TxInternalsTable';
import type { Sort, SortField } from 'ui/tx/internals/utils';
import TxPendingAlert from 'ui/tx/TxPendingAlert';
import TxSocketAlert from 'ui/tx/TxSocketAlert';
import useFetchTxInfo from 'ui/tx/useFetchTxInfo';

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

// const searchFn = (searchTerm: string) => (item: InternalTransaction): boolean => {
//   const formattedSearchTerm = searchTerm.toLowerCase();
//   return item.type.toLowerCase().includes(formattedSearchTerm) ||
//     item.from.hash.toLowerCase().includes(formattedSearchTerm) ||
//     item.to.hash.toLowerCase().includes(formattedSearchTerm);
// };

const TxInternals = () => {
  // filters are not implemented yet in api
  // const [ filters, setFilters ] = React.useState<Array<TxInternalsType>>([]);
  // const [ searchTerm, setSearchTerm ] = React.useState<string>('');
  const [ sort, setSort ] = React.useState<Sort>();
  const txInfo = useFetchTxInfo({ updateDelay: 5 * SECOND });
  const { data, isLoading, isError, pagination, isPaginationVisible } = useQueryWithPages({
    resourceName: 'tx_internal_txs',
    pathParams: { id: txInfo.data?.hash },
    options: {
      enabled: Boolean(txInfo.data?.hash) && Boolean(txInfo.data?.status),
    },
  });

  const isMobile = useIsMobile();

  // const handleFilterChange = React.useCallback((nextValue: Array<TxInternalsType>) => {
  //   setFilters(nextValue);
  // }, []);

  const handleSortToggle = React.useCallback((field: SortField) => {
    return () => {
      setSort(getNextSortValue(field));
    };
  }, []);

  if (!txInfo.isLoading && !txInfo.isError && !txInfo.data.status) {
    return txInfo.socketStatus ? <TxSocketAlert status={ txInfo.socketStatus }/> : <TxPendingAlert/>;
  }

  if (isLoading || txInfo.isLoading) {
    return (
      <>
        <Show below="lg"><SkeletonList/></Show>
        <Hide below="lg"><SkeletonTable columns={ [ '28%', '20%', '24px', '20%', '16%', '16%' ] }/></Hide>
      </>
    );
  }

  if (isError || txInfo.isError) {
    return <DataFetchAlert/>;
  }

  if (data.items.length === 0) {
    return <Text as="span">There are no internal transactions for this transaction.</Text>;
  }

  const content = (() => {
    const filteredData = data.items
      .slice()
      // .filter(({ type }) => filters.length > 0 ? filters.includes(type) : true)
      // .filter(searchFn(searchTerm))
      .sort(sortFn(sort));

    if (filteredData.length === 0) {
      return <EmptySearchResult text={ `Couldn${ apos }t find any transaction that matches your query.` }/>;
    }

    return isMobile ?
      <TxInternalsList data={ filteredData }/> :
      <TxInternalsTable data={ filteredData } sort={ sort } onSortToggle={ handleSortToggle } top={ isPaginationVisible ? 80 : 0 }/>;
  })();

  return (
    <Box>
      { isPaginationVisible && (
        <ActionBar mt={ -6 }>
          <Pagination ml="auto" { ...pagination }/>
        </ActionBar>
      ) }
      { /* <Flex mb={ 6 }>
        <TxInternalsFilter onFilterChange={ handleFilterChange } defaultFilters={ filters } appliedFiltersNum={ filters.length }/>
        <FilterInput onChange={ setSearchTerm } maxW="360px" ml={ 3 } size="xs" placeholder="Search by addresses, hash, method..."/>
      </Flex> */ }
      { content }
    </Box>
  );
};

export default TxInternals;
