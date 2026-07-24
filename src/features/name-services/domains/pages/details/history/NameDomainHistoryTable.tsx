// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type * as bens from '@blockscout/bens-types';

import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import { TableBody, TableColumnHeader, TableColumnHeaderSortable, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import NameDomainHistoryTableItem from './NameDomainHistoryTableItem';
import type { SortField, Sort } from './utils';
import { sortFn } from './utils';

interface Props {
  items: Array<bens.DomainEvent>;
  domain: bens.DetailedDomain | undefined;
  isLoading?: boolean;
  sort: Sort;
  onSortToggle: (field: SortField) => void;
  resetKey?: string;
}

const NameDomainHistoryTable = ({ items, domain, isLoading, sort, onSortToggle, resetKey }: Props) => {
  const sortedItems = React.useMemo(() => items.slice().sort(sortFn(sort)), [ items, sort ]);
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: sortedItems, isEnabled: !isLoading, resetKey });

  return (
    <TableRoot>
      <TableHeaderSticky top={ 0 }>
        <TableRow>
          <TableColumnHeader width="25%">Txn hash</TableColumnHeader>
          <TableColumnHeaderSortable
            width="25%"
            pl={ 9 }
            sortField="timestamp"
            sortValue={ sort }
            onSortToggle={ onSortToggle }
            contentAfter={ <TimeFormatToggle/> }
          >
            Timestamp
          </TableColumnHeaderSortable>
          <TableColumnHeader width="25%">From</TableColumnHeader>
          <TableColumnHeader width="25%">Method</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { sortedItems.slice(0, renderedItemsNum).map((item, index) => (
          <NameDomainHistoryTableItem key={ index } event={ item } domain={ domain } isLoading={ isLoading }/>
        )) }
        <TableRow ref={ cutRef }/>
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(NameDomainHistoryTable);
