import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

import ERC20TokensTableItem from './ERC20TokensTableItem';

interface Props {
  data: Array<AddressTokenBalance>;
  top: number;
  isLoading: boolean;
}

const ERC20TokensTable = ({ data, top, isLoading }: Props) => {
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
          <ERC20TokensTableItem key={ item.token.address_hash + (isLoading ? index : '') } { ...item } isLoading={ isLoading }/>
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default ERC20TokensTable;
