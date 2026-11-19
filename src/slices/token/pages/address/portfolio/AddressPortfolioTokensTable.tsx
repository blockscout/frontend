// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { AddressFungibleTokensItem } from 'src/slices/token/pages/address/types';

import { useUniqueKeys } from 'src/shared/lists/get-unique-keys';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import AddressPortfolioTokensTableItem from './AddressPortfolioTokensTableItem';

interface Props {
  data: Array<AddressFungibleTokensItem>;
  top: number;
  isLoading: boolean;
  resetKey?: string;
  hasAddToWallet?: boolean;
}

const getBaseKey = (item: AddressFungibleTokensItem): string =>
  item.token.address_hash + (item.chain_values ? Object.keys(item.chain_values).join(',') : '');

const AddressPortfolioTokensTable = ({ data, top, isLoading, resetKey, hasAddToWallet }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: data, isEnabled: !isLoading, resetKey });
  const keys = useUniqueKeys(data, getBaseKey);

  return (
    <TableRoot minW="900px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader width="55%">Asset</TableColumnHeader>
          <TableColumnHeader width="15%" isNumeric>Price</TableColumnHeader>
          <TableColumnHeader width="15%" isNumeric>Quantity</TableColumnHeader>
          <TableColumnHeader width="15%" isNumeric>Value</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { data.slice(0, renderedItemsNum).map((item, index) => (
          <AddressPortfolioTokensTableItem
            key={ keys[index] }
            data={ item }
            isLoading={ isLoading }
            hasAddToWallet={ hasAddToWallet }
          />
        )) }
        <TableRow ref={ cutRef }/>
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(AddressPortfolioTokensTable);
