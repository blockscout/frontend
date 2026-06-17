// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { AddressHighlightProvider } from 'src/slices/address/contexts/address-highlight';

import config from 'src/config';
import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import BeaconChainWithdrawalsTableItem from './BeaconChainWithdrawalsTableItem';

const feature = config.features.beaconChain;

interface Props {
  top: number;
  isLoading?: boolean;
  items: Array<schemas['Withdrawal']>;
  view: 'address' | 'block' | 'list';
};

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
          { items.slice(0, renderedItemsNum).map((item, index) => (
            <BeaconChainWithdrawalsTableItem key={ item.index + (isLoading ? String(index) : '') } item={ item } view={ view } isLoading={ isLoading }/>
          )) }
          <TableRow ref={ cutRef }/>
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default BeaconChainWithdrawalsTable;
