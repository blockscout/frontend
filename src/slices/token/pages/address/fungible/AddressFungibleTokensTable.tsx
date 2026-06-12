// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { AddressFungibleTokensItem } from '../types';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import AddressFungibleTokensTableItem from './AddressFungibleTokensTableItem';

interface Props {
  data: Array<AddressFungibleTokensItem>;
  top: number;
  isLoading: boolean;
  hasAdditionalTokenTypes?: boolean;
}

const AddressFungibleTokensTable = ({ data, top, isLoading, hasAdditionalTokenTypes }: Props) => {
  return (
    <TableRoot minW="900px">
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
          <AddressFungibleTokensTableItem
            key={ item.token.address_hash + (isLoading ? index : '') + (item.chain_values ? Object.keys(item.chain_values).join(',') : '') }
            { ...item }
            isLoading={ isLoading }
            hasAdditionalTokenTypes={ hasAdditionalTokenTypes }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default AddressFungibleTokensTable;
