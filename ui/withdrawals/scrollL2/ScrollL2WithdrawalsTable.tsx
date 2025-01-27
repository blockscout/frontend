import { Table, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';

import type { ScrollL2MessageItem } from 'types/api/scrollL2';

import config from 'configs/app';
import { default as Thead } from 'ui/shared/TheadSticky';

import ScrollL2WithdrawalsTableItem from './ScrollL2WithdrawalsTableItem';

 type Props = {
   items: Array<ScrollL2MessageItem>;
   top: number;
   isLoading?: boolean;
 };

const ScrollL2WithdrawalsTable = ({ items, top, isLoading }: Props) => {
  return (
    <Table style={{ tableLayout: 'auto' }} minW="950px">
      <Thead top={ top }>
        <Tr>
          <Th>L2 block</Th>
          <Th>Index</Th>
          <Th>L2 txn hash</Th>
          <Th>Age</Th>
          <Th>L1 txn hash</Th>
          <Th isNumeric>{ `Value ${ config.chain.currency.symbol }` }</Th>
        </Tr>
      </Thead>
      <Tbody>
        { items.map((item, index) => (
          <ScrollL2WithdrawalsTableItem key={ String(item.id) + (isLoading ? index : '') } item={ item } isLoading={ isLoading }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default ScrollL2WithdrawalsTable;
