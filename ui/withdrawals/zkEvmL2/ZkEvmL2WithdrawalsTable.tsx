import { Table, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';

import type { ZkEvmL2WithdrawalsItem } from 'types/api/zkEvmL2';

import { default as Thead } from 'ui/shared/TheadSticky';

import ZkEvmL2WithdrawalsTableItem from './ZkEvmL2WithdrawalsTableItem';

 type Props = {
   items: Array<ZkEvmL2WithdrawalsItem>;
   top: number;
   isLoading?: boolean;
 }

const ZkEvmL2DepositsTable = ({ items, top, isLoading }: Props) => {
  return (
    <Table variant="simple" size="sm" style={{ tableLayout: 'auto' }} minW="950px">
      <Thead top={ top }>
        <Tr>
          <Th>Block</Th>
          <Th>Index</Th>
          <Th>L2 txn hash</Th>
          <Th>Age</Th>
          <Th>L1 txn hash</Th>
          <Th isNumeric>Value</Th>
          <Th>Token</Th>
        </Tr>
      </Thead>
      <Tbody>
        { items.map((item, index) => (
          <ZkEvmL2WithdrawalsTableItem key={ String(item.index) + (isLoading ? index : '') } item={ item } isLoading={ isLoading }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default ZkEvmL2DepositsTable;
