import { Box } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { AddressCoinBalanceHistoryResponse } from 'types/api/address';
import type { PaginationParams } from 'ui/shared/pagination/types';

import type { ResourceError } from 'lib/api/resources';
import { useMultichainContext } from 'lib/contexts/multichain';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import AddressCoinBalanceListItem from './AddressCoinBalanceListItem';
import AddressCoinBalanceTableItem from './AddressCoinBalanceTableItem';

interface Props {
  query: UseQueryResult<AddressCoinBalanceHistoryResponse, ResourceError<unknown>> & {
    pagination: PaginationParams;
  };
  nativeExchangeRate?: string | null;
}

const AddressCoinBalanceHistory = ({ query, nativeExchangeRate }: Props) => {
  const multichainContext = useMultichainContext();
  const chainData = multichainContext?.chain;
  const tableMinWidth = '1080px';

  const content = query.data?.items ? (
    <>
      <Box hideBelow="lg" maxW="100%" overflowX="auto">
        <TableRoot minW={ tableMinWidth } tableLayout="fixed" w="100%">
          <colgroup>
            <col style={{ width: '170px' }}/>
            <col style={{ width: '240px' }}/>
            <col style={{ width: '230px' }}/>
            <col style={{ width: '120px' }}/>
            <col style={{ width: '160px' }}/>
            <col style={{ width: '160px' }}/>
          </colgroup>
          <TableHeaderSticky top={ 0 }>
            <TableRow>
              <TableColumnHeader width="170px" isNumeric>Delta</TableColumnHeader>
              <TableColumnHeader width="240px">Asset</TableColumnHeader>
              <TableColumnHeader width="230px" isNumeric pr={ 1 }>Balance</TableColumnHeader>
              <TableColumnHeader width="120px">Block</TableColumnHeader>
              <TableColumnHeader width="160px">Txid</TableColumnHeader>
              <TableColumnHeader width="160px">
                Age
                <TimeFormatToggle/>
              </TableColumnHeader>
            </TableRow>
          </TableHeaderSticky>
          <TableBody>
            { query.data.items.map((item, index) => (
              <AddressCoinBalanceTableItem
                key={ [
                  item.block_number,
                  item.token?.address_hash || 'native',
                  item.token_id,
                  query.isPlaceholderData ? String(index) : '',
                ].join(':') }
                { ...item }
                page={ query.pagination.page }
                isLoading={ query.isPlaceholderData }
                chainData={ chainData }
                nativeExchangeRate={ nativeExchangeRate }
              />
            )) }
          </TableBody>
        </TableRoot>
      </Box>
      <Box hideFrom="lg">
        { query.data.items.map((item, index) => (
          <AddressCoinBalanceListItem
            key={ [
              item.block_number,
              item.token?.address_hash || 'native',
              item.token_id,
              query.isPlaceholderData ? String(index) : '',
            ].join(':') }
            { ...item }
            page={ query.pagination.page }
            isLoading={ query.isPlaceholderData }
            chainData={ chainData }
            nativeExchangeRate={ nativeExchangeRate }
          />
        )) }
      </Box>
    </>
  ) : null;

  const actionBar = query.pagination.isVisible ? (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...query.pagination }/>
    </ActionBar>
  ) : null;

  return (
    <DataListDisplay
      mt={ 8 }
      isError={ query.isError }
      itemsNum={ query.data?.items.length }
      emptyText="There is no coin balance history for this address."
      actionBar={ actionBar }
    >
      { content }
    </DataListDisplay>
  );
};

export default React.memo(AddressCoinBalanceHistory);
