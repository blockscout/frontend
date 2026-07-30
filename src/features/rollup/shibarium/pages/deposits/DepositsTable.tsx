// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ShibariumDepositsItem } from 'src/features/rollup/shibarium/types/api';

import { AddressHighlightProvider } from 'src/slices/address/contexts/address-highlight';

import { layerLabels } from 'src/features/rollup/common/utils/layer';

import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import DepositsTableItem from './DepositsTableItem';

type Props = {
  items: Array<ShibariumDepositsItem>;
  top: number;
  isLoading?: boolean;
  resetKey?: string;
};

const DepositsTable = ({ items, top, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });

  return (
    <AddressHighlightProvider>
      <TableRoot tableLayout="auto" minW="950px">
        <TableHeaderSticky top={ top }>
          <TableRow>
            <TableColumnHeader>{ layerLabels.parent } block No</TableColumnHeader>
            <TableColumnHeader>{ layerLabels.parent } txn hash</TableColumnHeader>
            <TableColumnHeader>{ layerLabels.current } txn hash</TableColumnHeader>
            <TableColumnHeader>User</TableColumnHeader>
            <TableColumnHeader>
              Timestamp
              <TimeFormatToggle/>
            </TableColumnHeader>
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { items.slice(0, renderedItemsNum).map((item, index) => (
            <DepositsTableItem key={ `${ item.l2_transaction_hash }-${ index }` } item={ item } isLoading={ isLoading }/>
          )) }
          <TableRow ref={ cutRef }/>
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default DepositsTable;
