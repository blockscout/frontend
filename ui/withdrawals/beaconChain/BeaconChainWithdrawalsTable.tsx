import React from 'react';

import type { AddressWithdrawalsItem } from 'types/api/address';
import type { BlockWithdrawalsItem } from 'types/api/block';
import type { WithdrawalsItem } from 'types/api/withdrawals';

import config from 'configs/app';
import useLazyRenderedList from 'lib/hooks/useLazyRenderedList';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

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
    <TableRoot style={{ tableLayout: 'auto' }} minW="950px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader minW="140px">Index</TableColumnHeader>
          <TableColumnHeader minW="200px">Validator index</TableColumnHeader>
          { view !== 'block' && <TableColumnHeader w="25%">Block</TableColumnHeader> }
          { view !== 'address' && <TableColumnHeader w="25%">To</TableColumnHeader> }
          { view !== 'block' && <TableColumnHeader w="25%">Age</TableColumnHeader> }
          <TableColumnHeader w="25%">{ `Value ${ feature.currency.symbol }` }</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { view === 'list' && (items as Array<WithdrawalsItem>).slice(0, renderedItemsNum).map((item, index) => (
          <BeaconChainWithdrawalsTableItem key={ item.index + (isLoading ? String(index) : '') } item={ item } view="list" isLoading={ isLoading }/>
        )) }
        { view === 'address' && (items as Array<AddressWithdrawalsItem>).slice(0, renderedItemsNum).map((item, index) => (
          <BeaconChainWithdrawalsTableItem key={ item.index + (isLoading ? String(index) : '') } item={ item } view="address" isLoading={ isLoading }/>
        )) }
        { view === 'block' && (items as Array<BlockWithdrawalsItem>).slice(0, renderedItemsNum).map((item, index) => (
          <BeaconChainWithdrawalsTableItem key={ item.index + (isLoading ? String(index) : '') } item={ item } view="block" isLoading={ isLoading }/>
        )) }
        <TableRow ref={ cutRef }/>
      </TableBody>
    </TableRoot>
  );
};

export default BeaconChainWithdrawalsTable;
