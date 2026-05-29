// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ArbitrumL2MessagesItem } from '../types/api';

import { layerLabels } from 'src/features/rollup/common/utils/layer';

import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import type { MessagesDirection } from './ArbitrumL2Messages';
import ArbitrumL2MessagesTableItem from './ArbitrumL2MessagesTableItem';

type Props = {
  items: Array<ArbitrumL2MessagesItem>;
  direction: MessagesDirection;
  top: number;
  isLoading?: boolean;
};

const ArbitrumL2MessagesTable = ({ items, direction, top, isLoading }: Props) => {
  return (
    <TableRoot tableLayout="auto" minW="950px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          { direction === 'to-rollup' && <TableColumnHeader>{ layerLabels.parent } block</TableColumnHeader> }
          { direction === 'from-rollup' && <TableColumnHeader>From</TableColumnHeader> }
          <TableColumnHeader>Message #</TableColumnHeader>
          <TableColumnHeader>{ layerLabels.current } transaction</TableColumnHeader>
          <TableColumnHeader>
            Timestamp
            <TimeFormatToggle/>
          </TableColumnHeader>
          <TableColumnHeader>Status</TableColumnHeader>
          <TableColumnHeader>{ layerLabels.parent } transaction</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <ArbitrumL2MessagesTableItem
            key={ String(item.id) + (isLoading ? index : '') }
            item={ item }
            direction={ direction }
            isLoading={ isLoading }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default ArbitrumL2MessagesTable;
