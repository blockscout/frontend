// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { AddressHighlightProvider } from 'src/slices/address/contexts/address-highlight';
import { currencyUnits } from 'src/slices/chain/units';

import { useUniqueKeys } from 'src/shared/lists/get-unique-keys';
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

const getBaseKey = (item: schemas['InternalTransaction']): string => item.index.toString();

const TxInternalsTable = ({ data, sort, onSortToggle, top, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: data, isEnabled: !isLoading, resetKey });
  const keys = useUniqueKeys(data, getBaseKey);

  return (
    <AddressHighlightProvider>
      <TableRoot minW="900px">
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
            <TxInternalsTableItem key={ keys[index] } data={ item } isLoading={ isLoading }/>
          )) }
        </TableBody>
      </TableRoot>
      <div ref={ cutRef }/>
    </AddressHighlightProvider>
  );
};

export default TxInternalsTable;
