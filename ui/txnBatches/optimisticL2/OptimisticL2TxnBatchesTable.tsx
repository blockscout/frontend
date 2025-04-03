import React from 'react';

import type { OptimisticL2TxnBatchesItem } from 'types/api/optimisticL2';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

import OptimisticL2TxnBatchesTableItem from './OptimisticL2TxnBatchesTableItem';

type Props = {
  items: Array<OptimisticL2TxnBatchesItem>;
  top: number;
  isLoading?: boolean;
};

const OptimisticL2TxnBatchesTable = ({ items, top, isLoading }: Props) => {
  return (
    <TableRoot tableLayout="auto" minW="850px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader>Batch ID</TableColumnHeader>
          <TableColumnHeader>Storage</TableColumnHeader>
          <TableColumnHeader>Age</TableColumnHeader>
          <TableColumnHeader isNumeric>L1 txn count</TableColumnHeader>
          <TableColumnHeader isNumeric>L2 blocks</TableColumnHeader>
          <TableColumnHeader isNumeric>Txn</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <OptimisticL2TxnBatchesTableItem
            key={ item.internal_id + (isLoading ? String(index) : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default OptimisticL2TxnBatchesTable;
