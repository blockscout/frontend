import { Table, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';

import type { ShibariumWithdrawalsItem } from 'types/api/shibarium';

import { default as Thead } from 'ui/shared/TheadSticky';

import WithdrawalsTableItem from './WithdrawalsTableItem';

 type Props = {
   items: Array<ShibariumWithdrawalsItem>;
   top: number;
   isLoading?: boolean;
 }

const WithdrawalsTable = ({ items, top, isLoading }: Props) => {
  return (
    <Table variant="simple" size="sm" style={{ tableLayout: 'auto' }} minW="950px">
      <Thead top={ top }>
        <Tr>
          <Th>L2 block No</Th>
          <Th>L2 txn hash</Th>
          <Th>L1 txn hash</Th>
          <Th>User</Th>
          <Th>Age</Th>
        </Tr>
      </Thead>
      <Tbody>
        { items.map((item, index) => (
          <WithdrawalsTableItem key={ item.l2_transaction_hash + (isLoading ? index : '') } item={ item } isLoading={ isLoading }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default WithdrawalsTable;
