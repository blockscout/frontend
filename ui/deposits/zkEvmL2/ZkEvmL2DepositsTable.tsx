import { Table, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';

import type { ZkEvmL2DepositsItem } from 'types/api/zkEvmL2';

import { default as Thead } from 'ui/shared/TheadSticky';

import ZkEvmL2DepositsTableItem from './ZkEvmL2DepositsTableItem';

 type Props = {
   items: Array<ZkEvmL2DepositsItem>;
   top: number;
   isLoading?: boolean;
 };

const ZkEvmL2DepositsTable = ({ items, top, isLoading }: Props) => {
  return (
    <Table style={{ tableLayout: 'auto' }} minW="950px">
      <Thead top={ top }>
        <Tr>
          <Th>L1 block</Th>
          <Th>Index</Th>
          <Th>L1 txn hash</Th>
          <Th>Age</Th>
          <Th>L2 txn hash</Th>
          <Th isNumeric>Value</Th>
          <Th>Token</Th>
        </Tr>
      </Thead>
      <Tbody>
        { items.map((item, index) => (
          <ZkEvmL2DepositsTableItem key={ String(item.index) + (isLoading ? index : '') } item={ item } isLoading={ isLoading }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default ZkEvmL2DepositsTable;
