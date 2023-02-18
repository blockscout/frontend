import { Table, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';

import type { WithdrawalsItem } from 'types/api/withdrawals';

import { default as Thead } from 'ui/shared/TheadSticky';

import WithdrawalsTableItem from './WithdrawalsTableItem';

 type Props = {
   items: Array<WithdrawalsItem>;
   top: number;
 }

const WithdrawalsTable = ({ items, top }: Props) => {
  return (
    <Table variant="simple" size="sm" style={{ tableLayout: 'auto' }}>
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
        { items.map((item) => (
          <WithdrawalsTableItem key={ item.l2_tx_hash } { ...item }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default WithdrawalsTable;
