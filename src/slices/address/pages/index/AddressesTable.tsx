// SPDX-License-Identifier: LicenseRef-Blockscout

import type BigNumber from 'bignumber.js';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { currencyUnits } from 'src/slices/chain/units';

import { useUniqueKeys } from 'src/shared/lists/get-unique-keys';
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

const getBaseKey = (item: schemas['TopAddress']): string => item.hash;

const AddressesTable = ({ items, totalSupply, pageStartIndex, top, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });
  const keys = useUniqueKeys(items, getBaseKey);
  const hasPercentage = !totalSupply.eq(ZERO);
  return (
    <TableRoot minW="900px">
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
            key={ keys[index] }
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
