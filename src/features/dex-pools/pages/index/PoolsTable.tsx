// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type * as contractsInfo from '@blockscout/contracts-info-types';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import { useUniqueKeys } from 'src/shared/lists/get-unique-keys';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import PoolsTableItem from './PoolsTableItem';

interface Props {
  items: Array<contractsInfo.Pool>;
  page: number;
  isLoading?: boolean;
  top?: number;
  resetKey?: string;
};

const getBaseKey = (item: contractsInfo.Pool): string => item.pool_id;

const PoolsTable = ({ items, page, isLoading, top, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });
  const keys = useUniqueKeys(items, getBaseKey);

  return (
    <TableRoot minWidth="700px">
      <TableHeaderSticky top={ top ?? ACTION_BAR_HEIGHT_DESKTOP }>
        <TableRow>
          <TableColumnHeader width="70%">Pool</TableColumnHeader>
          <TableColumnHeader width="30%">DEX </TableColumnHeader>
          <TableColumnHeader width="130px" isNumeric>Liquidity</TableColumnHeader>
          <TableColumnHeader width="75px" isNumeric>View in</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.slice(0, renderedItemsNum).map((item, index) => (
          <PoolsTableItem key={ keys[index] } item={ item } index={ index } page={ page } isLoading={ isLoading }/>
        )) }
        <TableRow ref={ cutRef }/>
      </TableBody>
    </TableRoot>
  );
};

export default PoolsTable;
