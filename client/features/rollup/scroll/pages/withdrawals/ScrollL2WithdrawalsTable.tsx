// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ScrollL2MessageItem } from 'client/features/rollup/scroll/types/api';

import { AddressHighlightProvider } from 'client/slices/address/contexts/address-highlight';

import { layerLabels } from 'client/features/rollup/common/utils/layer';

import config from 'configs/app';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import ScrollL2WithdrawalsTableItem from './ScrollL2WithdrawalsTableItem';

type Props = {
  items: Array<ScrollL2MessageItem>;
  top: number;
  isLoading?: boolean;
};

const ScrollL2WithdrawalsTable = ({ items, top, isLoading }: Props) => {
  return (
    <AddressHighlightProvider>
      <TableRoot tableLayout="auto" minW="950px">
        <TableHeaderSticky top={ top }>
          <TableRow>
            <TableColumnHeader>{ layerLabels.current } block</TableColumnHeader>
            <TableColumnHeader>Index</TableColumnHeader>
            <TableColumnHeader>{ layerLabels.current } txn hash</TableColumnHeader>
            <TableColumnHeader>
              Timestamp
              <TimeFormatToggle/>
            </TableColumnHeader>
            <TableColumnHeader>{ layerLabels.parent } txn hash</TableColumnHeader>
            <TableColumnHeader isNumeric>{ `Value ${ config.chain.currency.symbol }` }</TableColumnHeader>
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { items.map((item, index) => (
            <ScrollL2WithdrawalsTableItem key={ String(item.id) + (isLoading ? index : '') } item={ item } isLoading={ isLoading }/>
          )) }
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default ScrollL2WithdrawalsTable;
