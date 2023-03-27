import { Table, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';

import type { DepositsItem } from 'types/api/deposits';

import { default as Thead } from 'ui/shared/TheadSticky';

import DepositsTableItem from './DepositsTableItem';

 type Props = {
   items: Array<DepositsItem>;
   top: number;
 }

const DepositsTable = ({ items, top }: Props) => {
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
        { items.map((item) => (
          <DepositsTableItem key={ item.l2_tx_hash } item={ item }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default DepositsTable;
