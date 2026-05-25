// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Text } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'client/api/hooks/useApiQuery';

import PageTitle from 'client/shell/page/title/PageTitle';

import { ZKSYNC_L2_TXN_BATCHES_ITEM } from 'client/features/rollup/zk-sync/stubs';

import DataList from 'client/shared/lists/DataList';
import StickyPaginationWithText from 'client/shared/pagination/StickyPaginationWithText';
import useQueryWithPages from 'client/shared/pagination/useQueryWithPages';
import { generateListStub } from 'client/shared/pagination/utils';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';

import ZkSyncTxnBatchesListItem from './ZkSyncTxnBatchesListItem';
import ZkSyncTxnBatchesTable from './ZkSyncTxnBatchesTable';

const ZkSyncL2TxnBatches = () => {
  const { data, isError, isPlaceholderData, pagination } = useQueryWithPages({
    resourceName: 'general:zksync_l2_txn_batches',
    options: {
      placeholderData: generateListStub<'general:zksync_l2_txn_batches'>(
        ZKSYNC_L2_TXN_BATCHES_ITEM,
        50,
        {
          next_page_params: {
            items_count: 50,
            number: 9045200,
          },
        },
      ),
    },
  });

  const countersQuery = useApiQuery('general:zksync_l2_txn_batches_count', {
    queryOptions: {
      placeholderData: 5231746,
    },
  });

  const content = data?.items ? (
    <>
      <Box hideFrom="lg">
        { data.items.map(((item, index) => (
          <ZkSyncTxnBatchesListItem
            key={ item.number + (isPlaceholderData ? String(index) : '') }
            item={ item }
            isLoading={ isPlaceholderData }
          />
        ))) }
      </Box>
      <Box hideBelow="lg">
        <ZkSyncTxnBatchesTable items={ data.items } top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 } isLoading={ isPlaceholderData }/>
      </Box>
    </>
  ) : null;

  const text = (() => {
    if (countersQuery.isError || isError || !data?.items.length) {
      return null;
    }

    return (
      <Skeleton loading={ countersQuery.isPlaceholderData || isPlaceholderData } display="flex" flexWrap="wrap">
        Txn batch
        <Text fontWeight={ 600 } whiteSpace="pre"> #{ data.items[0].number } </Text>to
        <Text fontWeight={ 600 } whiteSpace="pre"> #{ data.items[data.items.length - 1].number } </Text>
        (total of { countersQuery.data?.toLocaleString() } batches)
      </Skeleton>
    );
  })();

  const actionBar = <StickyPaginationWithText text={ text } pagination={ pagination }/>;

  return (
    <>
      <PageTitle title="Txn batches" withTextAd/>
      <DataList
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no txn batches."
        actionBar={ actionBar }
      >
        { content }
      </DataList>
    </>
  );
};

export default ZkSyncL2TxnBatches;
