import React from 'react';

import type { OptimisticL2OutputRootsItem } from 'types/api/optimisticL2';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

import OptimisticL2OutputRootsTableItem from './OptimisticL2OutputRootsTableItem';

type Props = {
  items: Array<OptimisticL2OutputRootsItem>;
  top: number;
  isLoading?: boolean;
};

const OptimisticL2OutputRootsTable = ({ items, top, isLoading }: Props) => {
  return (
    <TableRoot minW="900px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader width="160px">L2 output index</TableColumnHeader>
          <TableColumnHeader width="20%">Age</TableColumnHeader>
          <TableColumnHeader width="20%">L2 block #</TableColumnHeader>
          <TableColumnHeader width="30%">L1 txn hash</TableColumnHeader>
          <TableColumnHeader width="30%">Output root</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <OptimisticL2OutputRootsTableItem
            key={ item.l2_output_index + (Number(isLoading ? index : '') ? String(index) : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default OptimisticL2OutputRootsTable;
