// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import AddressFungibleTokensTableItem from './AddressFungibleTokensTableItem';

interface Props {
  data: Array<Pick<schemas['TokenBalance'], 'token' | 'value'>>;
  top: number;
  isLoading: boolean;
  hasAdditionalTokenTypes?: boolean;
  resetKey?: string;
}

const AddressFungibleTokensTable = ({ data, top, isLoading, hasAdditionalTokenTypes, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: data, isEnabled: !isLoading, resetKey });

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
        { data.slice(0, renderedItemsNum).map((item, index) => (
          <AddressFungibleTokensTableItem
            key={ (item.token?.address_hash ?? '') + (isLoading ? index : '') }
            { ...item }
            isLoading={ isLoading }
            hasAdditionalTokenTypes={ hasAdditionalTokenTypes }
          />
        )) }
        <TableRow ref={ cutRef }/>
      </TableBody>
    </TableRoot>
  );
};

export default AddressFungibleTokensTable;
