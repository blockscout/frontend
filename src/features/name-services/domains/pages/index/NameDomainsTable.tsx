// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type * as bens from '@blockscout/bens-types';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import { AddressHighlightProvider } from 'src/slices/address/contexts/address-highlight';

import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';

import { TableBody, TableColumnHeader, TableColumnHeaderSortable, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import NameDomainsTableItem from './NameDomainsTableItem';
import type { SortField, Sort } from './utils';

interface Props {
  data: bens.LookupDomainNameResponse | undefined;
  isLoading?: boolean;
  sort: Sort;
  onSortToggle: (field: SortField) => void;
}

const NameDomainsTable = ({ data, isLoading, sort, onSortToggle }: Props) => {
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
          { data?.items.map((item, index) => <NameDomainsTableItem key={ index } { ...item } isLoading={ isLoading }/>) }
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default React.memo(NameDomainsTable);
