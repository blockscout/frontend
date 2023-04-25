import { Table, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';

import type { AddressWithdrawalsItem } from 'types/api/address';
import type { BlockWithdrawalsItem } from 'types/api/block';
import type { WithdrawalsItem } from 'types/api/withdrawals';

import appConfig from 'configs/app/config';
import { default as Thead } from 'ui/shared/TheadSticky';

import WithdrawalsTableItem from './WithdrawalsTableItem';

 type Props = {
   top: number;
 } & ({
   items: Array<WithdrawalsItem>;
   view: 'list';
 } | {
   items: Array<AddressWithdrawalsItem>;
   view: 'address';
 } | {
   items: Array<BlockWithdrawalsItem>;
   view: 'block';
 });

const WithdrawalsTable = ({ items, top, view = 'list' }: Props) => {
  return (
    <Table variant="simple" size="sm" style={{ tableLayout: 'auto' }} minW="950px">
      <Thead top={ top }>
        <Tr>
          <Th>Index</Th>
          <Th>Validator index</Th>
          { view !== 'block' && <Th>Block</Th> }
          { view !== 'address' && <Th>To</Th> }
          { view !== 'block' && <Th>Age</Th> }
          <Th>{ `Value ${ appConfig.network.currency.symbol }` }</Th>
        </Tr>
      </Thead>
      <Tbody>
        { view === 'list' && (items as Array<WithdrawalsItem>).map((item) => (
          <WithdrawalsTableItem key={ item.index } item={ item } view="list"/>
        )) }
        { view === 'address' && (items as Array<AddressWithdrawalsItem>).map((item) => (
          <WithdrawalsTableItem key={ item.index } item={ item } view="address"/>
        )) }
        { view === 'block' && (items as Array<BlockWithdrawalsItem>).map((item) => (
          <WithdrawalsTableItem key={ item.index } item={ item } view="block"/>
        )) }
      </Tbody>
    </Table>
  );
};

export default WithdrawalsTable;
