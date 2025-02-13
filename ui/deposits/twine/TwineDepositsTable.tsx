import { Table, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';

import type { TwineL2DepositsItem } from 'types/api/twineL2';

import { default as Thead } from 'ui/shared/TheadSticky';

import TwineDepositsTableItem from './TwineDepositsTableItem';

 type Props = {
   items: Array<TwineL2DepositsItem>;
   top: number;
   isLoading?: boolean;
 };

const TwineDepositsTable = ({ items, top, isLoading }: Props) => {
  return (
    <Table style={{ tableLayout: 'auto' }} minW="950px">
      <Thead top={ top }>
        <Tr>
          <Th>Block No.</Th>
          <Th>Txn hash</Th>
          <Th>Age</Th>
          <Th>L1 Token Address</Th>
          <Th>L2 Token Address</Th>
          <Th>From</Th>
          <Th>To</Th>
        </Tr>
      </Thead>
      <Tbody>
        { items.map((item, index) => (
          <TwineDepositsTableItem key={ item.tx_hash + (isLoading ? index : '') } item={ item } isLoading={ isLoading }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default TwineDepositsTable;
