// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Text } from '@chakra-ui/react';
import { chunk } from 'es-toolkit';
import React, { useMemo, useState } from 'react';

import type { PaginationParams } from 'client/shared/pagination/types';

import useApiQuery from 'client/api/hooks/useApiQuery';

import ActionBar from 'client/shell/page/action-bar/ActionBar';

import AddressEntity from 'client/slices/address/components/entity/AddressEntity';

import { NOVES_TRANSLATE } from 'client/features/tx-interpretation/noves/stubs';

import DataList from 'client/shared/lists/DataList';
import Pagination from 'client/shared/pagination/Pagination';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

import { generateFlowViewData } from '../../utils/generateFlowViewData';
import TxAssetFlowsListItem from './TxAssetFlowsListItem';
import TxAssetFlowsTableItem from './TxAssetFlowsTableItem';

interface FlowViewProps {
  hash: string;
}

export default function TxAssetFlows(props: FlowViewProps) {

  const { data: queryData, isPlaceholderData, isError } = useApiQuery('general:noves_transaction', {
    pathParams: { hash: props.hash },
    queryOptions: {
      enabled: Boolean(props.hash),
      placeholderData: NOVES_TRANSLATE,
    },
  });

  const [ page, setPage ] = useState<number>(1);

  const ViewData = useMemo(() => (queryData ? generateFlowViewData(queryData) : []), [ queryData ]);
  const chunkedViewData = chunk(ViewData, 50);

  const paginationProps: PaginationParams = useMemo(() => ({
    onNextPageClick: () => setPage(page + 1),
    onPrevPageClick: () => setPage(page - 1),
    resetPage: () => setPage(1),
    canGoBackwards: page > 1,
    isLoading: isPlaceholderData,
    page: page,
    hasNextPage: Boolean(chunkedViewData[page]),
    hasPages: Boolean(chunkedViewData[1]),
    isVisible: Boolean(chunkedViewData[1]),
  }), [ chunkedViewData, page, isPlaceholderData ]);

  const data = chunkedViewData [page - 1];

  const actionBar = (
    <ActionBar mt={ -6 } pb={{ base: 6, md: 5 }} flexDir={{ base: 'column', md: 'initial' }} gap={{ base: '2', md: 'initial' }} >
      <Box display="flex" alignItems="center" gap={ 1 }>
        <Skeleton borderRadius="sm" loading={ isPlaceholderData } >
          <Text fontWeight="400" mr={ 1 }>
            Wallet
          </Text>
        </Skeleton>

        <AddressEntity
          address={{ hash: queryData?.accountAddress || '' }}
          fontWeight="400"
          truncation="dynamic"
          isLoading={ isPlaceholderData }
        />
      </Box>
      <Pagination ml={{ base: 'auto', lg: 8 }} { ...paginationProps }/>
    </ActionBar>
  );

  const content = (
    <>
      <Box hideFrom="lg">
        { data?.map((item, i) => (
          <TxAssetFlowsListItem
            key={ `${ i }-${ item.accountAddress }` }
            item={ item }
            isPlaceholderData={ isPlaceholderData }
          />
        )) }
      </Box>

      <Box hideBelow="lg">
        <TableRoot>
          <TableHeaderSticky top={ 75 }>
            <TableRow>
              <TableColumnHeader>
                Actions
              </TableColumnHeader>
              <TableColumnHeader width="450px">
                From/To
              </TableColumnHeader>
            </TableRow>
          </TableHeaderSticky>
          <TableBody>
            { data?.map((item, i) => (
              <TxAssetFlowsTableItem
                key={ `${ i }-${ item.accountAddress }` }
                item={ item }
                isPlaceholderData={ isPlaceholderData }
              />
            )) }
          </TableBody>
        </TableRoot>
      </Box>
    </>
  );

  return (
    <DataList
      isError={ isError }
      itemsNum={ data?.length }
      emptyText="There are no transfers."
      actionBar={ actionBar }
    >
      { content }
    </DataList>
  );
}
