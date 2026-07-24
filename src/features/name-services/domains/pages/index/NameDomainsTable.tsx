// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type * as bens from '@blockscout/bens-types';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import { AddressHighlightProvider } from 'src/slices/address/contexts/address-highlight';

import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import { TableBody, TableColumnHeader, TableColumnHeaderSortable, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import NameDomainsTableItem from './NameDomainsTableItem';
import type { SortField, Sort } from './utils';

interface Props {
  items: Array<bens.Domain>;
  isLoading?: boolean;
  sort: Sort;
  onSortToggle: (field: SortField) => void;
  resetKey?: string;
}

const NameDomainsTable = ({ items, isLoading, sort, onSortToggle, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });

  return (
    <AddressHighlightProvider>
      <TableRoot>
        <TableHeaderSticky top={ ACTION_BAR_HEIGHT_DESKTOP }>
          <TableRow>
            <TableColumnHeader width="25%">Domain</TableColumnHeader>
            <TableColumnHeader width="25%">Address</TableColumnHeader>
            <TableColumnHeaderSortable
              width="25%"
              pl={ 9 }
              sortField="registration_date"
              sortValue={ sort }
              onSortToggle={ onSortToggle }
              contentAfter={ <TimeFormatToggle/> }
            >
              Registered
            </TableColumnHeaderSortable>
            <TableColumnHeader width="25%">
              Expires
              <TimeFormatToggle/>
            </TableColumnHeader>
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { items.slice(0, renderedItemsNum).map((item, index) => (
            <NameDomainsTableItem key={ item.id + (isLoading ? index : '') } { ...item } isLoading={ isLoading }/>
          )) }
          <TableRow ref={ cutRef }/>
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default React.memo(NameDomainsTable);
