// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import type { NovesFlowViewItem } from '../../utils/generateFlowViewData';
import TxAssetFlowsTableItem from './TxAssetFlowsTableItem';

interface Props {
  items: Array<NovesFlowViewItem>;
  isPlaceholderData?: boolean;
  resetKey?: string;
}

const TxAssetFlowsTable = ({ items, isPlaceholderData, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isPlaceholderData, resetKey });

  return (
    <TableRoot>
      <TableHeaderSticky top={ 75 }>
        <TableRow>
          <TableColumnHeader>
            Actions
          </TableColumnHeader>
          <TableColumnHeader width="450px">
            From/To
          </TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.slice(0, renderedItemsNum).map((item, i) => (
          <TxAssetFlowsTableItem
            key={ `${ i }-${ item.accountAddress }` }
            item={ item }
            isPlaceholderData={ Boolean(isPlaceholderData) }
          />
        )) }
        <TableRow ref={ cutRef }/>
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(TxAssetFlowsTable);
