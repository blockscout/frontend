// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { AddressHighlightProvider } from 'src/slices/address/contexts/address-highlight';

import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import AddressEpochRewardsTableItem from './AddressEpochRewardsTableItem';

type Props = {
  items: Array<schemas['ElectionReward']>;
  isLoading?: boolean;
  top: number;
};

const AddressEpochRewardsTable = ({ items, isLoading, top }: Props) => {
  return (
    <AddressHighlightProvider>
      <TableRoot minW="1000px" style={{ tableLayout: 'auto' }}>
        <TableHeaderSticky top={ top }>
          <TableRow>
            <TableColumnHeader>
              Epoch
              <TimeFormatToggle/>
            </TableColumnHeader>
            <TableColumnHeader>Reward type</TableColumnHeader>
            <TableColumnHeader>Associated address</TableColumnHeader>
            <TableColumnHeader isNumeric>Value</TableColumnHeader>
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { items.map((item, index) => {
            return (
              <AddressEpochRewardsTableItem
                key={
                  (item.epoch_number ?? '0') +
                  (item.type ?? 'unknown') +
                  item.account.hash +
                  item.associated_account.hash +
                  (isLoading ? String(index) : '')
                }
                item={ item }
                isLoading={ isLoading }
              />
            );
          }) }
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default AddressEpochRewardsTable;
