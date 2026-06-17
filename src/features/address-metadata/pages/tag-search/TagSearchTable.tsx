// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { currencyUnits } from 'src/slices/chain/units';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import TagSearchTableItem from './TagSearchTableItem';

interface Props {
  items: Array<schemas['TopAddress']>;
  top: number;
  isLoading?: boolean;
}

const TagSearchTable = ({ items, top, isLoading }: Props) => {
  return (
    <TableRoot>
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader width="70%">Address</TableColumnHeader>
          <TableColumnHeader width="15%" isNumeric>{ `Balance ${ currencyUnits.ether }` }</TableColumnHeader>
          <TableColumnHeader width="15%" isNumeric>Txn count</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <TagSearchTableItem
            key={ item.hash + (isLoading ? index : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default TagSearchTable;
