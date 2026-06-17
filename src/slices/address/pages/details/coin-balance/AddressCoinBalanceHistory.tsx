// SPDX-License-Identifier: LicenseRef-Blockscout

import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { merged } from '@blockscout/api-types';
import type { PaginationParams } from 'src/shared/pagination/types';

import type { ResourceError } from 'src/api/resources';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import { currencyUnits } from 'src/slices/chain/units';

import { useMultichainContext } from 'src/features/multichain/context';

import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';
import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';

import { TableBody, TableColumnHeader, TableContainerScrollable, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import AddressCoinBalanceTableItem from './AddressCoinBalanceTableItem';

interface Props {
  query: UseQueryResult<
    merged.paths['/v2/addresses/{address_hash_param}/coin-balance-history']['get']['responses']['200']['content']['application/json'],
    ResourceError<unknown>
  > & {
    pagination: PaginationParams;
  };
}

const AddressCoinBalanceHistory = ({ query }: Props) => {
  const multichainContext = useMultichainContext();
  const chainData = multichainContext?.chain;

  const content = query.data?.items ? (
    <TableContainerScrollable>
      <TableRoot minW="900px">
        <TableHeaderSticky top={ query.pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }>
          <TableRow>
            { chainData && <TableColumnHeader width="38px"/> }
            <TableColumnHeader width="20%">Block</TableColumnHeader>
            <TableColumnHeader width="20%">Txn</TableColumnHeader>
            <TableColumnHeader width="20%">
              Timestamp
              <TimeFormatToggle/>
            </TableColumnHeader>
            <TableColumnHeader width="20%" isNumeric pr={ 1 }>Balance { currencyUnits.ether }</TableColumnHeader>
            <TableColumnHeader width="20%" isNumeric>Delta</TableColumnHeader>
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { query.data.items.map((item, index) => (
            <AddressCoinBalanceTableItem
              key={ item.block_number + (query.isPlaceholderData ? String(index) : '') }
              data={ item }
              page={ query.pagination.page }
              isLoading={ query.isPlaceholderData }
              chainData={ chainData }
            />
          )) }
        </TableBody>
      </TableRoot>
    </TableContainerScrollable>
  ) : null;

  const actionBar = query.pagination.isVisible ? (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...query.pagination }/>
    </ActionBar>
  ) : null;

  return (
    <DataList
      mt={ 8 }
      isError={ query.isError }
      itemsNum={ query.data?.items.length }
      emptyText="There is no coin balance history for this address."
      actionBar={ actionBar }
    >
      { content }
    </DataList>
  );
};

export default React.memo(AddressCoinBalanceHistory);
