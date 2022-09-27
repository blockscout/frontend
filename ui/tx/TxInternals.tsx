import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import type { TxInternalsType } from 'types/api/tx';
import type ArrayElement from 'types/utils/ArrayElement';

import { data } from 'data/txInternal';
import useIsMobile from 'lib/hooks/useIsMobile';
import { apos } from 'lib/html-entities';
import EmptySearchResult from 'ui/apps/EmptySearchResult';
import FilterInput from 'ui/shared/FilterInput';
import TxInternalsFilter from 'ui/tx/internals/TxInternalsFilter';
import TxInternalsList from 'ui/tx/internals/TxInternalsList';
import TxInternalsTable from 'ui/tx/internals/TxInternalsTable';

const searchFn = (searchTerm: string) => (item: ArrayElement<typeof data>): boolean => {
  const formattedSearchTerm = searchTerm.toLowerCase();
  return item.type.toLowerCase().includes(formattedSearchTerm) ||
    item.from.hash.toLowerCase().includes(formattedSearchTerm) ||
    item.to.hash.toLowerCase().includes(formattedSearchTerm);
};

const TxInternals = () => {
  const [ filters, setFilters ] = React.useState<Array<TxInternalsType>>([]);
  const [ searchTerm, setSearchTerm ] = React.useState<string>('');
  const isMobile = useIsMobile();

  const handleFilterChange = React.useCallback((nextValue: Array<TxInternalsType>) => {
    setFilters(nextValue);
  }, []);

  const content = (() => {
    const filteredData = data
      .filter(({ type }) => filters.length > 0 ? filters.includes(type) : true)
      .filter(searchFn(searchTerm));

    if (filteredData.length === 0) {
      return <EmptySearchResult text={ `Couldn${ apos }t find any transaction that matches your query.` }/>;
    }

    return isMobile ? <TxInternalsList data={ filteredData }/> : <TxInternalsTable data={ filteredData }/>;
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
