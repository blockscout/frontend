import React from 'react';

import type { CrossChainChainsStatsSortingField, CrossChainChainsStatsSortingValue } from '../../types/api';
import type { StatsChainRow } from '@blockscout/interchain-indexer-types';

import { TableBody, TableColumnHeader, TableColumnHeaderSortable, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import getNextSortValue from 'ui/shared/sort/getNextSortValue';

import { ICTT_USERS_SORT_SEQUENCE } from '../../utils/ictt-sort';
import IcttUsersTableItem from './IcttUsersTableItem';

interface Props {
  data: Array<StatsChainRow>;
  isLoading?: boolean;
  sort: CrossChainChainsStatsSortingValue;
  setSorting: ({ value }: { value: Array<string> }) => void;
}

const IcttUsersTable = ({ data, isLoading, sort, setSorting }: Props) => {

  const onSortToggle = React.useCallback((field: CrossChainChainsStatsSortingField) => {
    const value = getNextSortValue<CrossChainChainsStatsSortingField, CrossChainChainsStatsSortingValue>(ICTT_USERS_SORT_SEQUENCE, field)(sort);
    setSorting({ value: [ value ] });
  }, [ sort, setSorting ]);

  return (
    <TableRoot minW="1100px">
      <TableHeaderSticky top={ ACTION_BAR_HEIGHT_DESKTOP }>
        <TableRow>
          <TableColumnHeader width="50%">Chain</TableColumnHeader>
          <TableColumnHeaderSortable
            width="50%"
            isNumeric
            sortField="unique_transfer_users_count"
            sortValue={ sort }
            onSortToggle={ onSortToggle }
            disabled={ isLoading }
          >
            Number of unique ICTT users
          </TableColumnHeaderSortable>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { data.map((item, index) => (
          <IcttUsersTableItem
            key={ String(item.id) + (isLoading ? index : '') }
            data={ item }
            isLoading={ isLoading }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(IcttUsersTable);
