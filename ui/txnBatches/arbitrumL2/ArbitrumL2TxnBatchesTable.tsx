import { Table, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';

import type { ArbitrumL2TxnBatchesItem } from 'types/api/arbitrumL2';

import { default as Thead } from 'ui/shared/TheadSticky';

import ArbitrumL2TxnBatchesTableItem from './ArbitrumL2TxnBatchesTableItem';

type Props = {
  items: Array<ArbitrumL2TxnBatchesItem>;
  top: number;
  isLoading?: boolean;
};

const ArbitrumL2TxnBatchesTable = ({ items, top, isLoading }: Props) => {
  return (
    <Table minW="1000px" style={{ tableLayout: 'auto' }}>
      <Thead top={ top }>
        <Tr>
          <Th>Batch #</Th>
          <Th>L1 status</Th>
          <Th>L1 block</Th>
          <Th>Block count</Th>
          <Th>L1 transaction</Th>
          <Th>Age</Th>
          <Th>Txn count</Th>
        </Tr>
      </Thead>
      <Tbody>
        { items.map((item, index) => (
          <ArbitrumL2TxnBatchesTableItem
            key={ item.number + (isLoading ? String(index) : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </Tbody>
    </Table>
  );
};

export default ArbitrumL2TxnBatchesTable;
