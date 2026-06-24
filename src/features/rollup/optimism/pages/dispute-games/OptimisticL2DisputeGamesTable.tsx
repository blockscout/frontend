// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { layerLabels } from 'src/features/rollup/common/utils/layer';

import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import OptimisticL2DisputeGamesTableItem from './OptimisticL2DisputeGamesTableItem';

type Props = {
  items: Array<schemas['OptimismGame']>;
  top: number;
  isLoading?: boolean;
};

const OptimisticL2DisputeGamesTable = ({ items, top, isLoading }: Props) => {
  return (
    <TableRoot tableLayout="auto" minW="950px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader>Index</TableColumnHeader>
          <TableColumnHeader>Game type</TableColumnHeader>
          <TableColumnHeader>Address</TableColumnHeader>
          <TableColumnHeader>{ layerLabels.current } block #</TableColumnHeader>
          <TableColumnHeader>
            Timestamp
            <TimeFormatToggle/>
          </TableColumnHeader>
          <TableColumnHeader>Status</TableColumnHeader>
          <TableColumnHeader>
            Resolved
            <TimeFormatToggle/>
          </TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <OptimisticL2DisputeGamesTableItem
            key={ String(item.index) + (isLoading ? index : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default OptimisticL2DisputeGamesTable;
