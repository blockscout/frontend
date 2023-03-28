import { Hide, Show, Table, Tbody, Th, Tr } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { AddressCoinBalanceHistoryResponse } from 'types/api/address';

import appConfig from 'configs/app/config';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import type { Props as PaginationProps } from 'ui/shared/Pagination';
import Pagination from 'ui/shared/Pagination';
import { default as Thead } from 'ui/shared/TheadSticky';

import AddressCoinBalanceListItem from './AddressCoinBalanceListItem';
import AddressCoinBalanceTableItem from './AddressCoinBalanceTableItem';

interface Props {
  query: UseQueryResult<AddressCoinBalanceHistoryResponse> & {
    pagination: PaginationProps;
    isPaginationVisible: boolean;
  };
}

const AddressCoinBalanceHistory = ({ query }: Props) => {

  const content = query.data?.items ? (
    <>
      <Hide below="lg" ssr={ false }>
        <Table variant="simple" size="sm">
          <Thead top={ query.isPaginationVisible ? 80 : 0 }>
            <Tr>
              <Th width="20%">Block</Th>
              <Th width="20%">Txn</Th>
              <Th width="20%">Age</Th>
              <Th width="20%" isNumeric pr={ 1 }>Balance { appConfig.network.currency.symbol }</Th>
              <Th width="20%" isNumeric>Delta</Th>
            </Tr>
          </Thead>
          <Tbody>
            { query.data.items.map((item) => (
              <AddressCoinBalanceTableItem key={ item.block_number } { ...item } page={ query.pagination.page }/>
            )) }
          </Tbody>
        </Table>
      </Hide>
      <Show below="lg" ssr={ false }>
        { query.data.items.map((item) => (
          <AddressCoinBalanceListItem key={ item.block_number } { ...item } page={ query.pagination.page }/>
        )) }
      </Show>
    </>
  ) : null;

  const actionBar = query.isPaginationVisible ? (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...query.pagination }/>
    </ActionBar>
  ) : null;

  return (
    <DataListDisplay
      mt={ 8 }
      isError={ query.isError }
      isLoading={ query.isLoading }
      items={ query.data?.items }
      skeletonProps={{ skeletonDesktopColumns: [ '25%', '25%', '25%', '25%', '120px' ] }}
      emptyText="There is no coin balance history for this address."
      content={ content }
      actionBar={ actionBar }
    />
  );
};

export default React.memo(AddressCoinBalanceHistory);
