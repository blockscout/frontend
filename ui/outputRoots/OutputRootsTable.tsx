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
        { items.map((item) => (
          <OutputRootsTableItem key={ item.l2_output_index } { ...item }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default OutputRootsTable;
