import { Table, Thead, Tbody, Tr, Th, TableContainer, useBreakpointValue } from '@chakra-ui/react';
import React from 'react';

import { txs } from 'data/txs';

import TxsTableItem from './TxsTableItem';

const CURRENCY = 'xDAI';

const TxsTable = () => {
  const isLargeScreen = useBreakpointValue({ base: false, xl: true });

  return (
    <TableContainer width="100%" mt={ 6 }>
      <Table variant="simple" minWidth="810px" size="xs">
        <Thead>
          <Tr>
            <Th width="54px"></Th>
            <Th width="20%">Type</Th>
            <Th width="18%">Txn hash</Th>
            <Th width="15%">Method</Th>
            <Th width="11%">Block</Th>
            <Th width={ isLargeScreen ? '128px' : '58px' }>From</Th>
            <Th width={ isLargeScreen ? '36px' : '0' }></Th>
            <Th width={ isLargeScreen ? '128px' : '58px' }>To</Th>
            <Th width="18%" isNumeric>{ `Value ${ CURRENCY }` }</Th>
            <Th width="18%" isNumeric pr={ 5 }>{ `Fee ${ CURRENCY }` }</Th>
          </Tr>
        </Thead>
        <Tbody>
          { txs.map((item) => (
            <TxsTableItem
              key={ item.hash }
              tx={ item }
            />
          )) }
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default TxsTable;
