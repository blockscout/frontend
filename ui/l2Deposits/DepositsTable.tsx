import { Table, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';

import type { L2DepositsItem } from 'types/api/l2Deposits';

import { default as Thead } from 'ui/shared/TheadSticky';

import DepositsTableItem from './DepositsTableItem';

 type Props = {
   items: Array<L2DepositsItem>;
   top: number;
   isLoading?: boolean;
 }

const DepositsTable = ({ items, top, isLoading }: Props) => {
  return (
    <Table variant="simple" size="sm" style={{ tableLayout: 'auto' }} minW="950px">
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
          <DepositsTableItem key={ item.l2_tx_hash + (isLoading ? index : '') } item={ item } isLoading={ isLoading }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default DepositsTable;
