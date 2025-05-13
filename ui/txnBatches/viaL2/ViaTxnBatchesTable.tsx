import React from 'react';

import type { ViaBatchesItem } from 'types/api/viaL2';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

import ViaTxnBatchesTableItem from './ViaTxnBatchesTableItem';

type Props = {
  items: Array<ViaBatchesItem>;
  top: number;
  isLoading?: boolean;
};

const ViaTxnBatchesTable = ({ items, top, isLoading }: Props) => {
  return (
    <TableRoot minW="1000px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader width="40%">Batch #</TableColumnHeader>
          <TableColumnHeader width="60%">Status</TableColumnHeader>
          <TableColumnHeader width="150px">Age</TableColumnHeader>
          <TableColumnHeader width="150px">Txn count</TableColumnHeader>
          <TableColumnHeader width="210px">Commit tx</TableColumnHeader>
          <TableColumnHeader width="210px">Prove tx</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <ViaTxnBatchesTableItem
            key={ item.number + (isLoading ? String(index) : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default ViaTxnBatchesTable;
