import { Table, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';

import type { ScrollL2TxnBatch } from 'types/api/scrollL2';

import { default as Thead } from 'ui/shared/TheadSticky';

import ScrollL2TxnBatchesTableItem from './ScrollL2TxnBatchesTableItem';

type Props = {
  items: Array<ScrollL2TxnBatch>;
  top: number;
  isLoading?: boolean;
};

const ScrollL2TxnBatchesTable = ({ items, top, isLoading }: Props) => {
  return (
    <Table minW="1000px" style={{ tableLayout: 'auto' }}>
      <Thead top={ top }>
        <Tr>
          <Th>Batch #</Th>
          <Th>Container</Th>
          <Th>Status</Th>
          <Th>Committed block</Th>
          <Th>Committed txn hash</Th>
          <Th>Age</Th>
          <Th>Finalized block</Th>
          <Th>Finalized txn hash</Th>
          <Th isNumeric>Blocks</Th>
          <Th isNumeric>Txn</Th>
        </Tr>
      </Thead>
      <Tbody>
        { items.map((item, index) => (
          <ScrollL2TxnBatchesTableItem
            key={ item.number + (isLoading ? String(index) : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </Tbody>
    </Table>
  );
};

export default ScrollL2TxnBatchesTable;
