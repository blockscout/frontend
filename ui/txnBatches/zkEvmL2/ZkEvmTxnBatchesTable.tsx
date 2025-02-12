import { Table, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';

import type { ZkEvmL2TxnBatchesItem } from 'types/api/zkEvmL2';

import { default as Thead } from 'ui/shared/TheadSticky';

import ZkEvmTxnBatchesTableItem from './ZkEvmTxnBatchesTableItem';

type Props = {
  items: Array<ZkEvmL2TxnBatchesItem>;
  top: number;
  isLoading?: boolean;
};

const TxnBatchesTable = ({ items, top, isLoading }: Props) => {
  return (
    <Table minW="1000px">
      <Thead top={ top }>
        <Tr>
          <Th width="33%">Batch #</Th>
          <Th width="33%">Status</Th>
          <Th width="150px">Age</Th>
          <Th width="150px">Txn count</Th>
          <Th width="230px">Verify tx hash</Th>
          <Th width="230px">Sequence hash</Th>
        </Tr>
      </Thead>
      <Tbody>
        { items.map((item, index) => (
          <ZkEvmTxnBatchesTableItem
            key={ item.number + (isLoading ? String(index) : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </Tbody>
    </Table>
  );
};

export default TxnBatchesTable;
