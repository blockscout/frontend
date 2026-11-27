// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { useCurrencyUnits } from 'src/slices/chain/useCurrencyUnits';

import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import EpochsTableItem from './EpochsTableItem';

interface Props {
  items: Array<schemas['CeloEpoch']>;
  isLoading?: boolean;
  top: number;
  resetKey?: string;
};

const EpochsTable = ({ items, isLoading, top, resetKey }: Props) => {
  const currencyUnits = useCurrencyUnits();

  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });

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
          <TableColumnHeader w="25%" isNumeric>Community { currencyUnits.ether }</TableColumnHeader>
          <TableColumnHeader w="25%" isNumeric>Carbon offset { currencyUnits.ether }</TableColumnHeader>
          <TableColumnHeader w="25%" isNumeric>Total { currencyUnits.ether }</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.slice(0, renderedItemsNum).map((item, index) => {
          return (
            <EpochsTableItem
              key={ item.number + (isLoading ? String(index) : '') }
              item={ item }
              isLoading={ isLoading }
            />
          );
        }) }
        <TableRow ref={ cutRef }/>
      </TableBody>
    </TableRoot>
  );
};

export default EpochsTable;
