import { Box, Hide, Show, Table, Tbody, Th, Tr } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { Address } from 'types/api/address';
import { QueryKeys } from 'types/client/queries';

import appConfig from 'configs/app/config';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import Pagination from 'ui/shared/Pagination';
import { default as Thead } from 'ui/shared/TheadSticky';

import AddressCoinBalanceListItem from './AddressCoinBalanceListItem';
import AddressCoinBalanceTableItem from './AddressCoinBalanceTableItem';

interface Props {
  addressQuery: UseQueryResult<Address>;
}

const AddressCoinBalanceHistory = ({ addressQuery }: Props) => {
  const query = useQueryWithPages({
    apiPath: `/node-api/addresses/${ addressQuery.data?.hash }/coin-balance-history`,
    queryName: QueryKeys.addressCoinBalanceHistory,
    options: {
      enabled: Boolean(addressQuery.data),
    },
  });

  const isPaginatorHidden = !query.isLoading && !query.isError && query.pagination.page === 1 && !query.pagination.hasNextPage;

  const content = (() => {
    if (query.isLoading) {
      return <Box>loading</Box>;
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
                <AddressCoinBalanceTableItem key={ item.block_number } { ...item }/>
              )) }
            </Tbody>
          </Table>
        </Hide>
        <Show below="lg">
          { query.data.items.map((item) => (
            <AddressCoinBalanceListItem key={ item.block_number } { ...item }/>
          )) }
        </Show>
      </>
    );
  })();

  return (
    <Box mt={ 8 }>
      { !isPaginatorHidden && (
        <ActionBar>
          <Pagination ml="auto" { ...query.pagination }/>
        </ActionBar>
      ) }
      { content }
    </Box>
  );
};

export default React.memo(AddressCoinBalanceHistory);
