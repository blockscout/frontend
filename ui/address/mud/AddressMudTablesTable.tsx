import { Table, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';

import type { AddressMudTables } from 'types/api/address';

import { default as Thead } from 'ui/shared/TheadSticky';

import AddressMudTablesTableItem from './AddressMudTablesTableItem';

type Props = {
  items: AddressMudTables['items'];
  isLoading: boolean;
  top: number;
  scrollRef?: React.RefObject<HTMLDivElement>;
  hash: string;
}

//sorry for the naming
const AddressMudTablesTable = ({ items, isLoading, top, scrollRef, hash }: Props) => {
  return (
    <Table variant="simple" size="sm" style={{ tableLayout: 'auto' }}>
      <Thead top={ top }>
        <Tr>
          <Th width="24px"></Th>
          <Th>Full name</Th>
          <Th>Table ID</Th>
          <Th>Type</Th>
        </Tr>
      </Thead>
      <Tbody>
        { items.map((item, index) => (
          <AddressMudTablesTableItem
            key={ item.table.table_id + (isLoading ? String(index) : '') }
            item={ item }
            isLoading={ isLoading }
            scrollRef={ scrollRef }
            hash={ hash }
          />
        )) }
      </Tbody>
    </Table>
  );
};

export default AddressMudTablesTable;
