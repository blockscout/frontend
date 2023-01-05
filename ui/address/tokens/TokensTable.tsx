import { Table, Tbody, Tr, Th } from '@chakra-ui/react';
import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';

import { default as Thead } from 'ui/shared/TheadSticky';

import TokensTableItem from './TokensTableItem';

interface Props {
  data: Array<AddressTokenBalance>;
  top: number;
}

const TokensTable = ({ data, top }: Props) => {
  return (
    <Table variant="simple" size="sm">
      <Thead top={ top }>
        <Tr>
          <Th width="20%">Asset</Th>
          <Th width="40%">Contract address</Th>
          <Th width="10%" isNumeric>Price</Th>
          <Th width="20%" isNumeric>Quantity</Th>
          <Th width="10%" isNumeric>Value</Th>
        </Tr>
      </Thead>
      <Tbody>
        { data.map((item) => (
          <TokensTableItem key={ item.token.address } { ...item }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default TokensTable;
