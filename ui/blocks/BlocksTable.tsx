import { Table, Thead, Tbody, Tr, Th, TableContainer } from '@chakra-ui/react';
import React from 'react';

import { blocks } from 'data/blocks';
import useNetwork from 'lib/hooks/useNetwork';
import BlocksTableItem from 'ui/blocks/BlocksTableItem';

const BlocksTable = () => {
  const network = useNetwork();

  return (
    <TableContainer width="100%" mt={ 8 }>
      <Table variant="simple" minWidth="1040px" size="md" fontWeight={ 500 }>
        <Thead>
          <Tr>
            <Th width="124px">Block</Th>
            <Th width="112px">Size</Th>
            <Th width="144px">Miner</Th>
            <Th width="64px" isNumeric>Txn</Th>
            <Th width="40%">Gas used</Th>
            <Th width="30%">Reward { network?.currency }</Th>
            <Th width="30%">Burnt fees { network?.currency }</Th>
          </Tr>
        </Thead>
        <Tbody>
          { blocks.map((item, index) => <BlocksTableItem key={ item.height } data={ item } isPending={ index === 0 }/>) }
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default BlocksTable;
