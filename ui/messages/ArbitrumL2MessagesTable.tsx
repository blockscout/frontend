import { Table, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';

import type { ArbitrumL2MessagesItem } from 'types/api/arbitrumL2';

import { default as Thead } from 'ui/shared/TheadSticky';

import type { MessagesDirection } from './ArbitrumL2Messages';
import ArbitrumL2MessagesTableItem from './ArbitrumL2MessagesTableItem';

 type Props = {
   items: Array<ArbitrumL2MessagesItem>;
   direction: MessagesDirection;
   top: number;
   isLoading?: boolean;
 };

const ArbitrumL2MessagesTable = ({ items, direction, top, isLoading }: Props) => {
  return (
    <Table style={{ tableLayout: 'auto' }} minW="950px">
      <Thead top={ top }>
        <Tr>
          { direction === 'to-rollup' && <Th>L1 block</Th> }
          { direction === 'from-rollup' && <Th>From</Th> }
          <Th>Message #</Th>
          <Th>L2 transaction</Th>
          <Th>Age</Th>
          <Th>Status</Th>
          <Th>L1 transaction</Th>
        </Tr>
      </Thead>
      <Tbody>
        { items.map((item, index) => (
          <ArbitrumL2MessagesTableItem
            key={ String(item.id) + (isLoading ? index : '') }
            item={ item }
            direction={ direction }
            isLoading={ isLoading }
          />
        )) }
      </Tbody>
    </Table>
  );
};

export default ArbitrumL2MessagesTable;
