// SPDX-License-Identifier: LicenseRef-Blockscout

import type BigNumber from 'bignumber.js';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { currencyUnits } from 'src/slices/chain/units';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';
import { ZERO } from 'src/toolkit/utils/consts';

import AddressesTableItem from './AddressesTableItem';

interface Props {
  items: Array<schemas['TopAddress']>;
  totalSupply: BigNumber;
  pageStartIndex: number;
  top: number;
  isLoading?: boolean;
  resetKey?: string;
}

const AddressesTable = ({ items, totalSupply, pageStartIndex, top, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });
  const hasPercentage = !totalSupply.eq(ZERO);
  return (
    <TableRoot>
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader width="64px">Rank</TableColumnHeader>
          <TableColumnHeader width={ hasPercentage ? '50%' : '60%' }>Address</TableColumnHeader>
          <TableColumnHeader width={ hasPercentage ? '20%' : '25%' } isNumeric>{ `Balance ${ currencyUnits.ether }` }</TableColumnHeader>
          { hasPercentage && <TableColumnHeader width="15%" isNumeric>Percentage</TableColumnHeader> }
          <TableColumnHeader width="15%" isNumeric>Txn count</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.slice(0, renderedItemsNum).map((item, index) => (
          <AddressesTableItem
            key={ item.hash + (isLoading ? index : '') }
            item={ item }
            totalSupply={ totalSupply }
            index={ pageStartIndex + index }
            hasPercentage={ hasPercentage }
            isLoading={ isLoading }
          />
        )) }
        <TableRow ref={ cutRef }/>
      </TableBody>
    </TableRoot>
  );
};

export default AddressesTable;
