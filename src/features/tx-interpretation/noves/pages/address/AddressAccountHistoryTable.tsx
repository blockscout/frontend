// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { NovesResponseData } from 'src/features/tx-interpretation/noves/types/api';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import AddressAccountHistoryTableItem from './AddressAccountHistoryTableItem';

interface Props {
  items: Array<NovesResponseData>;
  currentAddress: string;
  isPlaceholderData?: boolean;
  resetKey?: string;
}

const AddressAccountHistoryTable = ({ items, currentAddress, isPlaceholderData, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isPlaceholderData, resetKey });

  return (
    <TableRoot minW="900px">
      <TableHeaderSticky top={ 75 }>
        <TableRow>
          <TableColumnHeader width="120px">
            Age
          </TableColumnHeader>
          <TableColumnHeader>
            Action
          </TableColumnHeader>
          <TableColumnHeader width="320px">
            From/To
          </TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody maxWidth="full">
        { items.slice(0, renderedItemsNum).map((item, i) => (
          <AddressAccountHistoryTableItem
            key={ `${ i }-${ item.rawTransactionData.transactionHash }` }
            tx={ item }
            currentAddress={ currentAddress }
            isPlaceholderData={ Boolean(isPlaceholderData) }
          />
        )) }
        <TableRow ref={ cutRef }/>
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(AddressAccountHistoryTable);
