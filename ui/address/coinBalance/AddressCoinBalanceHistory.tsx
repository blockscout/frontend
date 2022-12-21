import { Box, Hide, Show, Table, Tbody, Th, Tr } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { AddressCoinBalanceHistoryResponse } from 'types/api/address';

import appConfig from 'configs/app/config';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import type { Props as PaginationProps } from 'ui/shared/Pagination';
import Pagination from 'ui/shared/Pagination';
import SkeletonTable from 'ui/shared/SkeletonTable';
import { default as Thead } from 'ui/shared/TheadSticky';

import AddressCoinBalanceListItem from './AddressCoinBalanceListItem';
import AddressCoinBalanceSkeletonMobile from './AddressCoinBalanceSkeletonMobile';
import AddressCoinBalanceTableItem from './AddressCoinBalanceTableItem';

interface Props {
  query: UseQueryResult<AddressCoinBalanceHistoryResponse> & {
    pagination: PaginationProps;
    isPaginationVisible: boolean;
  };
}

const AddressCoinBalanceHistory = ({ query }: Props) => {

  const content = (() => {
    if (query.isLoading) {
      return (
        <>
          <Hide below="lg">
            <SkeletonTable columns={ [ '25%', '25%', '25%', '25%', '120px' ] }/>
          </Hide>
          <Show below="lg">
            <AddressCoinBalanceSkeletonMobile/>
          </Show>
        </>
      );
    }

    if (query.isError) {
      return <DataFetchAlert/>;
    }

    return (
      <>
        <Hide below="lg">
          <Table variant="simple" size="sm">
            <Thead top={ 80 }>
              <Tr>
                <Th width="25%">Block</Th>
                <Th width="25%">Txn</Th>
                <Th width="25%">Age</Th>
                <Th width="25%" isNumeric pr={ 1 }/>
                <Th width="120px" isNumeric>Balance { appConfig.network.currency.symbol }</Th>
              </Tr>
            </Thead>
            <Tbody>
              { query.data.items.map((item) => (
                <AddressCoinBalanceTableItem key={ item.block_number } { ...item } page={ query.pagination.page }/>
              )) }
            </Tbody>
          </Table>
        </Hide>
        <Show below="lg">
          { query.data.items.map((item) => (
            <AddressCoinBalanceListItem key={ item.block_number } { ...item } page={ query.pagination.page }/>
          )) }
        </Show>
      </>
    );
  })();

  return (
    <Box mt={ 8 }>
      { query.isPaginationVisible && (
        <ActionBar mt={ -6 }>
          <Pagination ml="auto" { ...query.pagination }/>
        </ActionBar>
      ) }
      { content }
    </Box>
  );
};

export default React.memo(AddressCoinBalanceHistory);
