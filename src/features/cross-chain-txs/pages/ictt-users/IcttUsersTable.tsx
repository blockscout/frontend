// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { CrossChainChainsStatsSortingField, CrossChainChainsStatsSortingValue } from '../../types/api';
import { StatsChainsSort } from '@blockscout/interchain-indexer-types';
import type { StatsChainRow } from '@blockscout/interchain-indexer-types';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import { useUniqueKeys } from 'src/shared/lists/get-unique-keys';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';
import getNextSortValue from 'src/shared/sort/get-next-sort-value';

import { TableBody, TableColumnHeader, TableColumnHeaderSortable, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import { ICTT_USERS_SORT_SEQUENCE } from '../../utils/ictt-sort';
import IcttUsersTableItem from './IcttUsersTableItem';

interface Props {
  data: Array<StatsChainRow>;
  isLoading?: boolean;
  sort: CrossChainChainsStatsSortingValue;
  setSorting: ({ value }: { value: Array<string> }) => void;
  resetKey?: string;
}

const getBaseKey = (item: StatsChainRow): string => String(item.id);

const IcttUsersTable = ({ data, isLoading, sort, setSorting, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: data, isEnabled: !isLoading, resetKey });
  const keys = useUniqueKeys(data, getBaseKey);

  const onSortToggle = React.useCallback((field: CrossChainChainsStatsSortingField) => {
    const value = getNextSortValue<CrossChainChainsStatsSortingField, CrossChainChainsStatsSortingValue>(ICTT_USERS_SORT_SEQUENCE, field)(sort);
    setSorting({ value: [ value ] });
  }, [ sort, setSorting ]);

  return (
    <TableRoot minW="500px">
      <TableHeaderSticky top={ ACTION_BAR_HEIGHT_DESKTOP }>
        <TableRow>
          <TableColumnHeader width="50%">Chain</TableColumnHeader>
          <TableColumnHeaderSortable
            width="50%"
            isNumeric
            sortField={ StatsChainsSort.UNIQUE_TRANSFER_USERS_COUNT }
            sortValue={ sort }
            onSortToggle={ onSortToggle }
            disabled={ isLoading }
          >
            Number of unique ICTT users
          </TableColumnHeaderSortable>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { data.slice(0, renderedItemsNum).map((item, index) => (
          <IcttUsersTableItem
            key={ keys[index] }
            data={ item }
            isLoading={ isLoading }
          />
        )) }
        <TableRow ref={ cutRef }/>
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(IcttUsersTable);
