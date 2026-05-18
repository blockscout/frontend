// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { WithdrawalsItem } from 'client/features/chain-variants/beacon-chain/types/api';
import type { AddressWithdrawalsItem } from 'client/slices/address/types/api';
import type { BlockWithdrawalsItem } from 'client/slices/block/types/api';

import { AddressHighlightProvider } from 'client/slices/address/contexts/address-highlight';

import useLazyRenderedList from 'client/shared/lists/useLazyRenderedList';

import config from 'configs/app';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

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
    <AddressHighlightProvider>
      <TableRoot style={{ tableLayout: 'auto' }} minW="950px">
        <TableHeaderSticky top={ top }>
          <TableRow>
            <TableColumnHeader>Index</TableColumnHeader>
            <TableColumnHeader>Validator index</TableColumnHeader>
            { view !== 'block' && <TableColumnHeader>Block</TableColumnHeader> }
            { view !== 'address' && <TableColumnHeader>To</TableColumnHeader> }
            { view !== 'block' && <TableColumnHeader>Timestamp<TimeFormatToggle/></TableColumnHeader> }
            <TableColumnHeader>{ `Value ${ feature.currency.symbol }` }</TableColumnHeader>
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
    </AddressHighlightProvider>
  );
};

export default BeaconChainWithdrawalsTable;
