import { Table, Thead, Tbody, Tr, Th, TableContainer } from '@chakra-ui/react';
import React from 'react';

import { data } from 'data/txInternal';
import TxInternalsTableItem from 'ui/tx/internals/TxInternalsTableItem';

const TxInternalsTable = () => {
  return (
    <TableContainer width="100%" mt={ 6 }>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th width="26%">Type</Th>
            <Th width="calc(20% + 40px)" pr="0">From</Th>
            <Th width="calc(20% - 40px)" pl="0">To</Th>
            <Th width="17%" isNumeric>Value</Th>
            <Th width="17%" isNumeric>Gas limit</Th>
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
  );
};

export default TxInternalsTable;
