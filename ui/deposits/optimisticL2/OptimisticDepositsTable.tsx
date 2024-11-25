import { Table, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';

import type { OptimisticL2DepositsItem } from 'types/api/optimisticL2';

import { default as Thead } from 'ui/shared/TheadSticky';

import OptimisticDepositsTableItem from './OptimisticDepositsTableItem';

 type Props = {
   items: Array<OptimisticL2DepositsItem>;
   top: number;
   isLoading?: boolean;
 };

const OptimisticDepositsTable = ({ items, top, isLoading }: Props) => {
  return (
    <Table style={{ tableLayout: 'auto' }} minW="950px">
      <Thead top={ top }>
        <Tr>
          <Th>L1 block No</Th>
          <Th>L2 txn hash</Th>
          <Th>Age</Th>
          <Th>L1 txn hash</Th>
          <Th>L1 txn origin</Th>
          <Th isNumeric>Gas limit</Th>
        </Tr>
      </Thead>
      <Tbody>
        { items.map((item, index) => (
          <OptimisticDepositsTableItem key={ item.l2_transaction_hash + (isLoading ? index : '') } item={ item } isLoading={ isLoading }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default OptimisticDepositsTable;
