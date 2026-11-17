// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { currencyUnits } from 'src/slices/chain/units';

import { useUniqueKeys } from 'src/shared/lists/get-unique-keys';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import TagSearchTableItem from './TagSearchTableItem';

interface Props {
  items: Array<schemas['TopAddress']>;
  top: number;
  isLoading?: boolean;
}

const getBaseKey = (item: schemas['TopAddress']): string => item.hash;

const TagSearchTable = ({ items, top, isLoading }: Props) => {
  const keys = useUniqueKeys(items, getBaseKey);

  return (
    <TableRoot minW="500px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader width="60%">Address</TableColumnHeader>
          <TableColumnHeader width="20%" isNumeric>{ `Balance ${ currencyUnits.ether }` }</TableColumnHeader>
          <TableColumnHeader width="20%" isNumeric>Txn count</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <TagSearchTableItem
            key={ keys[index] }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default TagSearchTable;
