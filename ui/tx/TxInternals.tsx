import { Box, Table, Thead, Tbody, Tr, Th, TableContainer } from '@chakra-ui/react';
import React from 'react';

import { data } from 'data/txInternal';
import Filters from 'ui/shared/Filters';
import TxInternalsTableItem from 'ui/tx/internals/TxInternalsTableItem';

const TxInternals = () => {
  return (
    <Box>
      <Filters/>
      <TableContainer width="100%" mt={ 6 }>
        <Table variant="simple" minWidth="950px">
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
            { data.map((item) => (
              <TxInternalsTableItem
                key={ item.id }
                { ...item }
              />
            )) }
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TxInternals;
