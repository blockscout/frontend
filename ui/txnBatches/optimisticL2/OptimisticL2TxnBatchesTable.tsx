import { Table, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';

import type { OptimisticL2TxnBatchesItem } from 'types/api/optimisticL2';

import { default as Thead } from 'ui/shared/TheadSticky';

import OptimisticL2TxnBatchesTableItem from './OptimisticL2TxnBatchesTableItem';

type Props = {
  items: Array<OptimisticL2TxnBatchesItem>;
  top: number;
  isLoading?: boolean;
}

const OptimisticL2TxnBatchesTable = ({ items, top, isLoading }: Props) => {
  return (
    <Table variant="simple" size="sm" minW="850px" layout="auto">
      <Thead top={ top }>
        <Tr>
          <Th>Batch ID</Th>
          <Th >Storage</Th>
          <Th >Age</Th>
          <Th isNumeric>L1 txn count</Th>
          <Th isNumeric>L2 blocks</Th>
          <Th isNumeric>Txn</Th>
        </Tr>
      </Thead>
      <Tbody>
        { items.map((item, index) => (
          <OptimisticL2TxnBatchesTableItem
            key={ item.internal_id + (isLoading ? String(index) : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </Tbody>
    </Table>
  );
};

export default OptimisticL2TxnBatchesTable;
