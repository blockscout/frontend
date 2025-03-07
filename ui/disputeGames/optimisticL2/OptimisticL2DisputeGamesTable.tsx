import { Table, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';

import type { OptimisticL2DisputeGamesItem } from 'types/api/optimisticL2';

import { default as Thead } from 'ui/shared/TheadSticky';

import OptimisticL2DisputeGamesTableItem from './OptimisticL2DisputeGamesTableItem';

type Props = {
  items: Array<OptimisticL2DisputeGamesItem>;
  top: number;
  isLoading?: boolean;
};

const OptimisticL2DisputeGamesTable = ({ items, top, isLoading }: Props) => {
  return (
    <Table style={{ tableLayout: 'auto' }} minW="950px">
      <Thead top={ top }>
        <Tr>
          <Th>Index</Th>
          <Th>Game type</Th>
          <Th>Address</Th>
          <Th>L2 block #</Th>
          <Th>Age</Th>
          <Th>Status</Th>
          <Th>Resolution age</Th>
        </Tr>
      </Thead>
      <Tbody>
        { items.map((item, index) => (
          <OptimisticL2DisputeGamesTableItem
            key={ String(item.index) + (isLoading ? index : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </Tbody>
    </Table>
  );
};

export default OptimisticL2DisputeGamesTable;
