// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { OptimisticL2WithdrawalsItem } from 'client/features/rollup/optimism/types/api';

import { AddressHighlightProvider } from 'client/slices/address/contexts/address-highlight';

import { layerLabels } from 'client/features/rollup/common/utils/layer';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import OptimisticL2WithdrawalsTableItem from './OptimisticL2WithdrawalsTableItem';

type Props = {
  items: Array<OptimisticL2WithdrawalsItem>;
  top: number;
  isLoading?: boolean;
};

const OptimisticL2WithdrawalsTable = ({ items, top, isLoading }: Props) => {
  return (
    <AddressHighlightProvider>
      <TableRoot tableLayout="auto" minW="950px">
        <TableHeaderSticky top={ top }>
          <TableRow>
            <TableColumnHeader>Msg nonce</TableColumnHeader>
            <TableColumnHeader>From</TableColumnHeader>
            <TableColumnHeader>{ layerLabels.current } txn hash</TableColumnHeader>
            <TableColumnHeader>
              Timestamp
              <TimeFormatToggle/>
            </TableColumnHeader>
            <TableColumnHeader>Status</TableColumnHeader>
            <TableColumnHeader>{ layerLabels.parent } txn hash</TableColumnHeader>
            <TableColumnHeader>Time left</TableColumnHeader>
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { items.map((item, index) => (
            <OptimisticL2WithdrawalsTableItem
              key={ String(item.msg_nonce_version) + item.msg_nonce + (isLoading ? index : '') }
              item={ item }
              isLoading={ isLoading }
            />
          )) }
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default OptimisticL2WithdrawalsTable;
