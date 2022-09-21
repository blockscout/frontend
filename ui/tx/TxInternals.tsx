import { Box, Flex, Table, Thead, Tbody, Tr, Th, TableContainer } from '@chakra-ui/react';
import React from 'react';

import type { TxInternalsType } from 'types/api/tx';

import { data } from 'data/txInternal';
import TxInternalsFilter from 'ui/tx/internals/TxInternalsFilter';
import TxInternalsTableItem from 'ui/tx/internals/TxInternalsTableItem';

const DEFAULT_FILTERS: Array<TxInternalsType> = [ 'call', 'delegate_call', 'static_call', 'create', 'create2', 'self_destruct', 'reward' ];

const TxInternals = () => {
  const [ filters, setFilters ] = React.useState<Array<TxInternalsType>>(DEFAULT_FILTERS);

  const handleFilterChange = React.useCallback((nextValue: Array<TxInternalsType>) => {
    setFilters(nextValue);
  }, []);

  return (
    <Box>
      <Flex>
        <TxInternalsFilter onFilterChange={ handleFilterChange } defaultFilters={ filters } appliedFiltersNum={ filters.length }/>
      </Flex>
      <TableContainer width="100%" mt={ 6 }>
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
            { data
              .filter(({ type }) => filters.includes(type))
              .map((item) => <TxInternalsTableItem key={ item.id } { ...item }/>) }
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TxInternals;
