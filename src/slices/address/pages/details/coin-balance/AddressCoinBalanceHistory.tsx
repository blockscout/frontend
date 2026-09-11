// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import { currencyUnits } from 'src/slices/chain/units';

import { useMultichainContext } from 'src/features/multichain/context';

import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';
import DataList from 'src/shared/lists/DataList';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';
import Pagination from 'src/shared/pagination/Pagination';
import type { QueryWithPagesResult } from 'src/shared/pagination/useQueryWithPages';

import { TableBody, TableColumnHeader, TableContainerScrollable, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import AddressCoinBalanceTableItem from './AddressCoinBalanceTableItem';

interface Props {
  query: QueryWithPagesResult<'core:address_coin_balance'>;
  resetKey?: string;
}

const AddressCoinBalanceHistory = ({ query, resetKey }: Props) => {
  const multichainContext = useMultichainContext();
  const chainData = multichainContext?.chain;
  const items = query.data?.items ?? [];
  const { cutRef, renderedItemsNum } = useLazyRenderedList({
    list: items,
    isEnabled: !query.isInitialLoading,
    resetKey,
  });

  const content = query.data?.items ? (
    <>
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
            { items.slice(0, renderedItemsNum).map((item, index) => (
              <AddressCoinBalanceTableItem
                key={ item.block_number + (query.isInitialLoading ? String(index) : '') }
                data={ item }
                page={ query.pagination.page }
                isLoading={ query.isInitialLoading }
                chainData={ chainData }
              />
            )) }
          </TableBody>
        </TableRoot>
      </TableContainerScrollable>
      <Box ref={ cutRef } h={ 0 }/>
    </>
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
      isTransitioning={ query.isTransitioning }
    >
      { content }
    </DataList>
  );
};

export default React.memo(AddressCoinBalanceHistory);
