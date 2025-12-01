import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

import ERC7984TokensTableItem from './ERC7984TokensTableItem';

interface Props {
  data: Array<AddressTokenBalance>;
  top: number;
  isLoading: boolean;
}

const ERC7984TokensTable = ({ data, top, isLoading }: Props) => {
  return (
    <TableRoot>
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader width="30%">Asset</TableColumnHeader>
          <TableColumnHeader width="30%">Contract address</TableColumnHeader>
          <TableColumnHeader width="10%" isNumeric>Price</TableColumnHeader>
          <TableColumnHeader width="15%" isNumeric>Quantity</TableColumnHeader>
          <TableColumnHeader width="15%" isNumeric>Value</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { data.map((item, index) => (
          <ERC7984TokensTableItem key={ item.token.address_hash + (isLoading ? index : '') } { ...item } isLoading={ isLoading }/>
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default ERC7984TokensTable;
