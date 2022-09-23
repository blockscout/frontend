import { Box, Flex, Table, Thead, Tbody, Tr, Th, TableContainer } from '@chakra-ui/react';
import React from 'react';

import type { TxInternalsType } from 'types/api/tx';
import type ArrayElement from 'types/utils/ArrayElement';

import { data } from 'data/txInternal';
import { apos } from 'lib/html-entities';
import EmptySearchResult from 'ui/apps/EmptySearchResult';
import FilterInput from 'ui/shared/FilterInput';
import TxInternalsFilter from 'ui/tx/internals/TxInternalsFilter';
import TxInternalsTableItem from 'ui/tx/internals/TxInternalsTableItem';

const searchFn = (searchTerm: string) => (item: ArrayElement<typeof data>): boolean => {
  const formattedSearchTerm = searchTerm.toLowerCase();
  return item.type.toLowerCase().includes(formattedSearchTerm) ||
    item.from.toLowerCase().includes(formattedSearchTerm) ||
    item.to.toLowerCase().includes(formattedSearchTerm);
};

const TxInternals = () => {
  const [ filters, setFilters ] = React.useState<Array<TxInternalsType>>([]);
  const [ searchTerm, setSearchTerm ] = React.useState<string>('');

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

    return (
      <TableContainer width="100%">
        <Table variant="simple" minWidth="950px" size="sm">
          <Thead>
            <Tr>
              <Th width="20%">Type</Th>
              <Th width="calc(20% + 40px)" pr="0">From</Th>
              <Th width="calc(20% - 40px)" pl="0">To</Th>
              <Th width="20%" isNumeric>Value</Th>
              <Th width="20%" isNumeric>Gas limit</Th>
            </Tr>
          </Thead>
          <Tbody>
            { filteredData.map((item) => <TxInternalsTableItem key={ item.id } { ...item }/>) }
          </Tbody>
        </Table>
      </TableContainer>
    );
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
