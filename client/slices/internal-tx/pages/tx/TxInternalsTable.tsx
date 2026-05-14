// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { InternalTransaction } from 'client/slices/internal-tx/types/api';

import { AddressHighlightProvider } from 'client/slices/address/contexts/address-highlight';

import { currencyUnits } from 'client/shared/chain/units';

import { TableBody, TableColumnHeader, TableColumnHeaderSortable, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

import type { Sort, SortField } from '../../utils/utils';
import TxInternalsTableItem from './TxInternalsTableItem';

interface Props {
  data: Array<InternalTransaction>;
  sort: Sort;
  onSortToggle: (field: SortField) => void;
  top: number;
  isLoading?: boolean;
}

const TxInternalsTable = ({ data, sort, onSortToggle, top, isLoading }: Props) => {
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
          { data.map((item, index) => (
            <TxInternalsTableItem key={ item.index.toString() + (isLoading ? index : '') } { ...item } isLoading={ isLoading }/>
          )) }
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default TxInternalsTable;
