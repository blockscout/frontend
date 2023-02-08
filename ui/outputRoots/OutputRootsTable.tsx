import { Table, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';

import type { OutputRootsItem } from 'types/api/outputRoots';

import { default as Thead } from 'ui/shared/TheadSticky';

import OutputRootsTableItem from './OutputRootsTableItem';

type Props = {
  items: Array<OutputRootsItem>;
  top: number;
}

const OutputRootsTable = ({ items, top }: Props) => {
  return (
    <Table variant="simple" size="sm">
      <Thead top={ top }>
        <Tr>
          <Th width="130px">L2 output index</Th>
          <Th width="120px">Age</Th>
          <Th width="15%">L2 block #</Th>
          <Th width="45%">L1 txn hash</Th>
          <Th width="35%">Output root</Th>
        </Tr>
      </Thead>
      <Tbody>
        { items.map((item) => (
          <OutputRootsTableItem key={ item.l2_output_index } { ...item }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default OutputRootsTable;
