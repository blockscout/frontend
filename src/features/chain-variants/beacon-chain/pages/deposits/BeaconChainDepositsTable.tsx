// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { AddressHighlightProvider } from 'src/slices/address/contexts/address-highlight';

import config from 'src/config';
import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import BeaconChainDepositsTableItem from './BeaconChainDepositsTableItem';

const feature = config.features.beaconChain;

interface Props {
  top: number;
  isLoading?: boolean;
  items: Array<schemas['BeaconDeposit']>;
  view: 'list' | 'address' | 'block';
};

const BeaconChainDepositsTable = ({ items, isLoading, top, view }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList(items, !isLoading);

  if (!feature.isEnabled || feature.withdrawalsOnly) {
    return null;
  }

  return (
    <AddressHighlightProvider>
      <TableRoot minW="1100px">
        <TableHeaderSticky top={ top }>
          <TableRow>
            <TableColumnHeader w="200px">Transaction hash</TableColumnHeader>
            { view !== 'block' && <TableColumnHeader>Block</TableColumnHeader> }
            { view !== 'block' && <TableColumnHeader w="180px">Timestamp<TimeFormatToggle/></TableColumnHeader> }
            <TableColumnHeader>{ `Value ${ feature.currency.symbol }` }</TableColumnHeader>
            { view !== 'address' && <TableColumnHeader w="200px">From</TableColumnHeader> }
            <TableColumnHeader>PubKey</TableColumnHeader>
            <TableColumnHeader>Signature</TableColumnHeader>
            <TableColumnHeader>Status</TableColumnHeader>
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { items.slice(0, renderedItemsNum).map((item, index) => (
            <BeaconChainDepositsTableItem key={ item.index + (isLoading ? String(index) : '') } item={ item } view={ view } isLoading={ isLoading }/>
          )) }
          <TableRow ref={ cutRef }/>
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default BeaconChainDepositsTable;
