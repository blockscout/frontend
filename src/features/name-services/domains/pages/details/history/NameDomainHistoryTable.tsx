// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type * as bens from '@blockscout/bens-types';

import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';

import { TableBody, TableColumnHeader, TableColumnHeaderSortable, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import NameDomainHistoryTableItem from './NameDomainHistoryTableItem';
import type { SortField, Sort } from './utils';
import { sortFn } from './utils';

interface Props {
  history: bens.ListDomainEventsResponse | undefined;
  domain: bens.DetailedDomain | undefined;
  isLoading?: boolean;
  sort: Sort;
  onSortToggle: (field: SortField) => void;
}

const NameDomainHistoryTable = ({ history, domain, isLoading, sort, onSortToggle }: Props) => {
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
        {
          history?.items
            .slice()
            .sort(sortFn(sort))
            .map((item, index) => <NameDomainHistoryTableItem key={ index } event={ item } domain={ domain } isLoading={ isLoading }/>)
        }
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(NameDomainHistoryTable);
