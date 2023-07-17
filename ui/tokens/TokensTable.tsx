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
    <Table>
      <Thead top={ 80 }>
        <Tr>
          <Th w="50%">Token</Th>
          <Th isNumeric w="15%">Price</Th>
          <Th isNumeric w="20%">On-chain market cap</Th>
          <Th isNumeric w="15%">Holders</Th>
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
