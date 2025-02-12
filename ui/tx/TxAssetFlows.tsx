import { Table, Tbody, Tr, Th, Box, Skeleton, Text, Show, Hide } from '@chakra-ui/react';
import _chunk from 'lodash/chunk';
import React, { useMemo, useState } from 'react';

import type { PaginationParams } from 'ui/shared/pagination/types';

import useApiQuery from 'lib/api/useApiQuery';
import { NOVES_TRANSLATE } from 'stubs/noves/NovesTranslate';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import Pagination from 'ui/shared/pagination/Pagination';
import TheadSticky from 'ui/shared/TheadSticky';

import TxAssetFlowsListItem from './assetFlows/TxAssetFlowsListItem';
import TxAssetFlowsTableItem from './assetFlows/TxAssetFlowsTableItem';
import { generateFlowViewData } from './assetFlows/utils/generateFlowViewData';

interface FlowViewProps {
  hash: string;
}

export default function TxAssetFlows(props: FlowViewProps) {

  const { data: queryData, isPlaceholderData, isError } = useApiQuery('noves_transaction', {
    pathParams: { hash: props.hash },
    queryOptions: {
      enabled: Boolean(props.hash),
      placeholderData: NOVES_TRANSLATE,
    },
  });

  const [ page, setPage ] = useState<number>(1);

  const ViewData = useMemo(() => (queryData ? generateFlowViewData(queryData) : []), [ queryData ]);
  const chunkedViewData = _chunk(ViewData, 50);

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
        <Skeleton borderRadius="sm" isLoaded={ !isPlaceholderData } >
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
      <Hide above="lg" >
        { data?.map((item, i) => (
          <TxAssetFlowsListItem
            key={ `${ i }-${ item.accountAddress }` }
            item={ item }
            isPlaceholderData={ isPlaceholderData }
          />
        )) }
      </Hide>

      <Show above="lg">
        <Table>
          <TheadSticky top={ 75 }>
            <Tr>
              <Th>
                Actions
              </Th>
              <Th width="450px">
                From/To
              </Th>
            </Tr>
          </TheadSticky>
          <Tbody>
            { data?.map((item, i) => (
              <TxAssetFlowsTableItem
                key={ `${ i }-${ item.accountAddress }` }
                item={ item }
                isPlaceholderData={ isPlaceholderData }
              />
            )) }
          </Tbody>
        </Table>
      </Show>
    </>
  );

  return (
    <DataListDisplay
      isError={ isError }
      items={ data }
      emptyText="There are no transfers."
      content={ content }
      actionBar={ actionBar }
    />
  );
}
