// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ShibariumWithdrawalsItem } from 'client/features/rollup/shibarium/types/api';

import { AddressHighlightProvider } from 'client/slices/address/contexts/address-highlight';

import { layerLabels } from 'client/features/rollup/common/utils/layer';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import WithdrawalsTableItem from './WithdrawalsTableItem';

type Props = {
  items: Array<ShibariumWithdrawalsItem>;
  top: number;
  isLoading?: boolean;
};

const WithdrawalsTable = ({ items, top, isLoading }: Props) => {
  return (
    <AddressHighlightProvider>
      <TableRoot tableLayout="auto" minW="950px">
        <TableHeaderSticky top={ top }>
          <TableRow>
            <TableColumnHeader>{ layerLabels.current } block No</TableColumnHeader>
            <TableColumnHeader>{ layerLabels.current } txn hash</TableColumnHeader>
            <TableColumnHeader>{ layerLabels.parent } txn hash</TableColumnHeader>
            <TableColumnHeader>User</TableColumnHeader>
            <TableColumnHeader>
              Timestamp
              <TimeFormatToggle/>
            </TableColumnHeader>
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { items.map((item, index) => (
            <WithdrawalsTableItem key={ `${ item.l2_transaction_hash }-${ index }` } item={ item } isLoading={ isLoading }/>
          )) }
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default WithdrawalsTable;
