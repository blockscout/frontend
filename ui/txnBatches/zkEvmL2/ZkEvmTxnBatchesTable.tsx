import React from 'react';

import type { ZkEvmL2TxnBatchesItem } from 'types/api/zkEvmL2';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

import ZkEvmTxnBatchesTableItem from './ZkEvmTxnBatchesTableItem';

type Props = {
  items: Array<ZkEvmL2TxnBatchesItem>;
  top: number;
  isLoading?: boolean;
};

const TxnBatchesTable = ({ items, top, isLoading }: Props) => {
  return (
    <TableRoot minW="1000px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader width="33%">Batch #</TableColumnHeader>
          <TableColumnHeader width="33%">Status</TableColumnHeader>
          <TableColumnHeader width="150px">Age</TableColumnHeader>
          <TableColumnHeader width="150px">Txn count</TableColumnHeader>
          <TableColumnHeader width="230px">Verify tx hash</TableColumnHeader>
          <TableColumnHeader width="230px">Sequence hash</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <ZkEvmTxnBatchesTableItem
            key={ item.number + (isLoading ? String(index) : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default TxnBatchesTable;
