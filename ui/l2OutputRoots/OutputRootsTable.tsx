import { Table, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';

import type { L2OutputRootsItem } from 'types/api/l2OutputRoots';

import { default as Thead } from 'ui/shared/TheadSticky';

import OutputRootsTableItem from './OutputRootsTableItem';

type Props = {
  items: Array<L2OutputRootsItem>;
  top: number;
  isLoading?: boolean;
}

const OutputRootsTable = ({ items, top, isLoading }: Props) => {
  return (
    <Table variant="simple" size="sm" minW="900px">
      <Thead top={ top }>
        <Tr>
          <Th width="140px">L2 output index</Th>
          <Th width="20%">Age</Th>
          <Th width="20%">L2 block #</Th>
          <Th width="30%">L1 txn hash</Th>
          <Th width="30%">Output root</Th>
        </Tr>
      </Thead>
      <Tbody>
        { items.map((item, index) => (
          <OutputRootsTableItem key={ item.l2_output_index + (Number(isLoading ? index : '') ? String(index) : '') } item={ item } isLoading={ isLoading }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default OutputRootsTable;
