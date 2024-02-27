import { Table, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';

import type { OptimisticL2WithdrawalsItem } from 'types/api/optimisticL2';

import { default as Thead } from 'ui/shared/TheadSticky';

import OptimisticL2WithdrawalsTableItem from './OptimisticL2WithdrawalsTableItem';

 type Props = {
   items: Array<OptimisticL2WithdrawalsItem>;
   top: number;
   isLoading?: boolean;
 }

const OptimisticL2WithdrawalsTable = ({ items, top, isLoading }: Props) => {
  return (
    <Table variant="simple" size="sm" style={{ tableLayout: 'auto' }} minW="950px">
      <Thead top={ top }>
        <Tr>
          <Th>Msg nonce</Th>
          <Th>From</Th>
          <Th>L2 txn hash</Th>
          <Th>Age</Th>
          <Th>Status</Th>
          <Th>L1 txn hash</Th>
          <Th>Time left</Th>
        </Tr>
      </Thead>
      <Tbody>
        { items.map((item, index) => (
          <OptimisticL2WithdrawalsTableItem key={ item.l2_tx_hash + (isLoading ? index : '') } item={ item } isLoading={ isLoading }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default OptimisticL2WithdrawalsTable;
