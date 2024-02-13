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
    <Table variant="simple" size="sm" minW="850px">
      <Thead top={ top }>
        <Tr>
          <Th width="170px">L2 block #</Th>
          <Th width="170px">L2 block txn count</Th>
          <Th width="100%">L1 txn hash</Th>
          <Th width="150px">Age</Th>
        </Tr>
      </Thead>
      <Tbody>
        { items.map((item, index) => (
          <OptimisticL2TxnBatchesTableItem
            key={ item.l2_block_number + (isLoading ? String(index) : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </Tbody>
    </Table>
  );
};

export default OptimisticL2TxnBatchesTable;
