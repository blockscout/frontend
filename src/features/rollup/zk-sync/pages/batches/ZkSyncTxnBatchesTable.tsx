// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ZkSyncBatchesItem } from 'src/features/rollup/zk-sync/types/api';

import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import ZkSyncTxnBatchesTableItem from './ZkSyncTxnBatchesTableItem';

type Props = {
  items: Array<ZkSyncBatchesItem>;
  top: number;
  isLoading?: boolean;
  resetKey?: string;
};

const ZkSyncTxnBatchesTable = ({ items, top, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });

  return (
    <TableRoot minW="1000px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader width="40%">Batch #</TableColumnHeader>
          <TableColumnHeader width="60%">Status</TableColumnHeader>
          <TableColumnHeader width="180px">
            Timestamp
            <TimeFormatToggle/>
          </TableColumnHeader>
          <TableColumnHeader width="120px">Txn count</TableColumnHeader>
          <TableColumnHeader width="210px">Commit tx</TableColumnHeader>
          <TableColumnHeader width="210px">Prove tx</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.slice(0, renderedItemsNum).map((item, index) => (
          <ZkSyncTxnBatchesTableItem
            key={ item.number + (isLoading ? String(index) : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
        <TableRow ref={ cutRef }/>
      </TableBody>
    </TableRoot>
  );
};

export default ZkSyncTxnBatchesTable;
