import { Table, Tbody, Tr, Th } from '@chakra-ui/react';
import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';

import { default as Thead } from 'ui/shared/TheadSticky';

import ERC721TokensTableItem from './ERC721TokensTableItem';

interface Props {
  data: Array<AddressTokenBalance>;
  top: number;
}

const ERC721TokensTable = ({ data, top }: Props) => {
  return (
    <Table variant="simple" size="sm">
      <Thead top={ top }>
        <Tr>
          <Th width="40%">Asset</Th>
          <Th width="40%">Contract address</Th>
          <Th width="20%" isNumeric>Quantity</Th>
        </Tr>
      </Thead>
      <Tbody>
        { data.map((item) => (
          <ERC721TokensTableItem key={ item.token.address } { ...item }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default ERC721TokensTable;
