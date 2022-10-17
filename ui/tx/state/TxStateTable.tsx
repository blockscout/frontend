import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
} from '@chakra-ui/react';
import React from 'react';

import appConfig from 'configs/app/config';
import { data } from 'data/txState';
import TxStateTableItem from 'ui/tx/state/TxStateTableItem';

const TxStateTable = () => {
  return (
    <TableContainer width="100%" mt={ 6 }>
      <Table variant="simple" minWidth="950px" size="sm" w="auto">
        <Thead>
          <Tr>
            <Th width="92px">Storage</Th>
            <Th width="146px">Address</Th>
            <Th width="120px">Miner</Th>
            <Th width="33%" isNumeric>{ `After ${ appConfig.network.currency }` }</Th>
            <Th width="33%" isNumeric>{ `Before ${ appConfig.network.currency }` }</Th>
            <Th width="33%" isNumeric>{ `State difference ${ appConfig.network.currency }` }</Th>
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
