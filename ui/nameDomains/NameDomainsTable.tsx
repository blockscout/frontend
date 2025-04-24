import React from 'react';

import type * as bens from '@blockscout/bens-types';

import { TableBody, TableColumnHeader, TableColumnHeaderSortable, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';

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
          >
            Registered on
          </TableColumnHeaderSortable>
          <TableColumnHeader width="25%">Expiration date</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { data?.items.map((item, index) => <NameDomainsTableItem key={ index } { ...item } isLoading={ isLoading }/>) }
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(NameDomainsTable);
