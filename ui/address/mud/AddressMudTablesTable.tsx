import React from 'react';

import type { AddressMudTables } from 'types/api/address';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

import AddressMudTablesTableItem from './AddressMudTablesTableItem';

type Props = {
  items: AddressMudTables['items'];
  isLoading: boolean;
  top: number;
  scrollRef?: React.RefObject<HTMLDivElement>;
  hash: string;
};

//sorry for the naming
const AddressMudTablesTable = ({ items, isLoading, top, scrollRef, hash }: Props) => {
  return (
    <TableRoot style={{ tableLayout: 'auto' }}>
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader width="24px"></TableColumnHeader>
          <TableColumnHeader>Full name</TableColumnHeader>
          <TableColumnHeader>Table ID</TableColumnHeader>
          <TableColumnHeader>Type</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <AddressMudTablesTableItem
            key={ item.table.table_id + (isLoading ? String(index) : '') }
            item={ item }
            isLoading={ isLoading }
            scrollRef={ scrollRef }
            hash={ hash }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default AddressMudTablesTable;
