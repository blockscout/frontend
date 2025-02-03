import { Table, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';

import type { Pool } from 'types/api/pools';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import { default as Thead } from 'ui/shared/TheadSticky';

import PoolsTableItem from './PoolsTableItem';

type Props = {
  items: Array<Pool>;
  page: number;
  isLoading?: boolean;
  top?: number;
};

const PoolsTable = ({ items, page, isLoading, top }: Props) => {
  return (
    <Table minWidth="900px">
      <Thead top={ top ?? ACTION_BAR_HEIGHT_DESKTOP }>
        <Tr>
          <Th width="70%">Pool</Th>
          <Th width="30%">DEX </Th>
          <Th width="130px" isNumeric>Liquidity</Th>
          <Th width="75px" isNumeric>View in</Th>
        </Tr>
      </Thead>
      <Tbody>
        { items.map((item, index) => (
          <PoolsTableItem key={ item.contract_address + (isLoading ? index : '') } item={ item } index={ index } page={ page } isLoading={ isLoading }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default PoolsTable;
