import { Table, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';

import type { AddressWithdrawalsItem } from 'types/api/address';
import type { BlockWithdrawalsItem } from 'types/api/block';
import type { WithdrawalsItem } from 'types/api/withdrawals';

import config from 'configs/app';
import useLazyRenderedList from 'lib/hooks/useLazyRenderedList';
import { default as Thead } from 'ui/shared/TheadSticky';

import BeaconChainWithdrawalsTableItem from './BeaconChainWithdrawalsTableItem';

const feature = config.features.beaconChain;

 type Props = {
   top: number;
   isLoading?: boolean;
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

const BeaconChainWithdrawalsTable = ({ items, isLoading, top, view }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList(items, !isLoading);

  if (!feature.isEnabled) {
    return null;
  }

  return (
    <Table variant="simple" size="sm" style={{ tableLayout: 'auto' }} minW="950px">
      <Thead top={ top }>
        <Tr>
          <Th minW="140px">Index</Th>
          <Th minW="200px">Validator index</Th>
          { view !== 'block' && <Th w="25%">Block</Th> }
          { view !== 'address' && <Th w="25%">To</Th> }
          { view !== 'block' && <Th w="25%">Age</Th> }
          <Th w="25%">{ `Value ${ feature.currency.symbol }` }</Th>
        </Tr>
      </Thead>
      <Tbody>
        { view === 'list' && (items as Array<WithdrawalsItem>).slice(0, renderedItemsNum).map((item, index) => (
          <BeaconChainWithdrawalsTableItem key={ item.index + (isLoading ? String(index) : '') } item={ item } view="list" isLoading={ isLoading }/>
        )) }
        { view === 'address' && (items as Array<AddressWithdrawalsItem>).slice(0, renderedItemsNum).map((item, index) => (
          <BeaconChainWithdrawalsTableItem key={ item.index + (isLoading ? String(index) : '') } item={ item } view="address" isLoading={ isLoading }/>
        )) }
        { view === 'block' && (items as Array<BlockWithdrawalsItem>).slice(0, renderedItemsNum).map((item, index) => (
          <BeaconChainWithdrawalsTableItem key={ item.index + (isLoading ? String(index) : '') } item={ item } view="block" isLoading={ isLoading }/>
        )) }
        <tr ref={ cutRef }/>
      </Tbody>
    </Table>
  );
};

export default BeaconChainWithdrawalsTable;
