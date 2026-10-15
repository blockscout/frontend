// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { AddressTokenItem } from 'src/features/multichain/types/client';

import { useUniqueKeys } from 'src/shared/lists/get-unique-keys';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import MultichainAddressTokensTableItem from './MultichainAddressTokensTableItem';

interface Props {
  data: Array<AddressTokenItem>;
  top: number;
  isLoading: boolean;
  resetKey?: string;
}

const getBaseKey = (item: AddressTokenItem): string =>
  item.token.address_hash + (item.chain_values ? Object.keys(item.chain_values).join(',') : '');

const MultichainAddressTokensTable = ({ data, top, isLoading, resetKey }: Props) => {
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
          <MultichainAddressTokensTableItem
            key={ keys[index] }
            data={ item }
            isLoading={ isLoading }
          />
        )) }
        <TableRow ref={ cutRef }/>
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(MultichainAddressTokensTable);
