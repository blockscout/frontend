import { Table, Tbody, Tr, Th } from '@chakra-ui/react';
import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';

import { default as Thead } from 'ui/shared/TheadSticky';

import ERC20TokensTableItem from './ERC20TokensTableItem';

interface Props {
  data: Array<AddressTokenBalance>;
  top: number;
  isLoading: boolean;
}

const ERC20TokensTable = ({ data, top, isLoading }: Props) => {
  return (
    <Table>
      <Thead top={ top }>
        <Tr>
          <Th width="30%">Asset</Th>
          <Th width="30%">Contract address</Th>
          <Th width="10%" isNumeric>Price</Th>
          <Th width="15%" isNumeric>Quantity</Th>
          <Th width="15%" isNumeric>Value</Th>
        </Tr>
      </Thead>
      <Tbody>
        { data.map((item, index) => (
          <ERC20TokensTableItem key={ item.token.address + (isLoading ? index : '') } { ...item } isLoading={ isLoading }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default ERC20TokensTable;
