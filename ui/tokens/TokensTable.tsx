import { Table, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfo } from 'types/api/token';

import { default as Thead } from 'ui/shared/TheadSticky';

import TokensTableItem from './TokensTableItem';

type Props = {
  items: Array<TokenInfo>;
  page: number;
  isLoading?: boolean;
}

const TokensTable = ({ items, page, isLoading }: Props) => {
  return (
    <Table style={{ tableLayout: 'auto' }}>
      <Thead top={ 80 }>
        <Tr>
          <Th>Token</Th>
          <Th isNumeric>Price</Th>
          <Th isNumeric>On-chain market cap</Th>
          <Th isNumeric>Holders</Th>
        </Tr>
      </Thead>
      <Tbody>
        { items.map((item, index) => (
          <TokensTableItem key={ item.address + (isLoading ? index : '') } token={ item } index={ index } page={ page } isLoading={ isLoading }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default TokensTable;
