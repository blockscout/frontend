// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import config from 'src/config';
import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import EpochsTableItem from './EpochsTableItem';

interface Props {
  items: Array<schemas['CeloEpoch']>;
  isLoading?: boolean;
  top: number;
};

const EpochsTable = ({ items, isLoading, top }: Props) => {
  return (
    <TableRoot minW="1100px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader w="280px">
            Epoch
            <TimeFormatToggle/>
          </TableColumnHeader>
          <TableColumnHeader w="120px">Status</TableColumnHeader>
          <TableColumnHeader w="25%">Block range</TableColumnHeader>
          <TableColumnHeader w="25%" isNumeric>Community { config.chain.currency.symbol }</TableColumnHeader>
          <TableColumnHeader w="25%" isNumeric>Carbon offset { config.chain.currency.symbol }</TableColumnHeader>
          <TableColumnHeader w="25%" isNumeric>Total { config.chain.currency.symbol }</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => {
          return (
            <EpochsTableItem
              key={ item.number + (isLoading ? String(index) : '') }
              item={ item }
              isLoading={ isLoading }
            />
          );
        }) }
      </TableBody>
    </TableRoot>
  );
};

export default EpochsTable;
