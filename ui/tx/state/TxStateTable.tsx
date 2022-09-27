import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
} from '@chakra-ui/react';
import React from 'react';

import { data } from 'data/txState';
import TxStateTableItem from 'ui/tx/state/TxStateTableItem';

const CURRENCY = 'ETH';

const TxStateTable = () => {
  return (
    <TableContainer width="100%" mt={ 6 }>
      <Table variant="simple" minWidth="950px" size="sm">
        <Thead>
          <Tr>
            <Th width="92px">Storage</Th>
            <Th width="146px">Address</Th>
            <Th width="120px">Miner</Th>
            <Th width="33%" isNumeric>{ `After ${ CURRENCY }` }</Th>
            <Th width="33%" isNumeric>{ `Before ${ CURRENCY }` }</Th>
            <Th width="33%" isNumeric>{ `State difference ${ CURRENCY }` }</Th>
          </Tr>
        </Thead>
        <Tbody>
          { data.map((item, index) => <TxStateTableItem txStateItem={ item } key={ index }/>) }
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default TxStateTable;
