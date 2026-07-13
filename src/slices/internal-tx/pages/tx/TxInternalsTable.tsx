// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { AddressHighlightProvider } from 'src/slices/address/contexts/address-highlight';
import { currencyUnits } from 'src/slices/chain/units';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import { TableBody, TableColumnHeader, TableColumnHeaderSortable, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import type { Sort, SortField } from '../../utils/utils';
import TxInternalsTableItem from './TxInternalsTableItem';

interface Props {
  data: Array<schemas['InternalTransaction']>;
  sort: Sort;
  onSortToggle: (field: SortField) => void;
  top: number;
  isLoading?: boolean;
  resetKey?: string;
}

const TxInternalsTable = ({ data, sort, onSortToggle, top, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: data, isEnabled: !isLoading, resetKey });

  return (
    <AddressHighlightProvider>
      <TableRoot>
        <TableHeaderSticky top={ top }>
          <TableRow>
            <TableColumnHeader width="28%">Type</TableColumnHeader>
            <TableColumnHeader width="40%">From/To</TableColumnHeader>
            <TableColumnHeaderSortable
              width="16%"
              isNumeric
              sortField="value"
              sortValue={ sort }
              onSortToggle={ onSortToggle }
            >
              Value { currencyUnits.ether }
            </TableColumnHeaderSortable>
            <TableColumnHeaderSortable
              width="16%"
              isNumeric
              sortField="gas-limit"
              sortValue={ sort }
              onSortToggle={ onSortToggle }
            >
              Gas limit
            </TableColumnHeaderSortable>
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { data.slice(0, renderedItemsNum).map((item, index) => (
            <TxInternalsTableItem key={ item.index.toString() + (isLoading ? index : '') } data={ item } isLoading={ isLoading }/>
          )) }
        </TableBody>
      </TableRoot>
      <div ref={ cutRef }/>
    </AddressHighlightProvider>
  );
};

export default TxInternalsTable;
