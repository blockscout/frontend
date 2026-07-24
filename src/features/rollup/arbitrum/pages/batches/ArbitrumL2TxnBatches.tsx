// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Text } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';
import PageTitle from 'src/shell/page/title/PageTitle';

import DataList from 'src/shared/lists/DataList';
import StickyPaginationWithText from 'src/shared/pagination/StickyPaginationWithText';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

import { ARBITRUM_L2_TXN_BATCHES_ITEM } from '../../stubs';
import ArbitrumL2TxnBatchesList from './ArbitrumL2TxnBatchesList';
import ArbitrumL2TxnBatchesTable from './ArbitrumL2TxnBatchesTable';

const ArbitrumL2TxnBatches = () => {
  const { data, isError, isPlaceholderData, pagination, queryHash } = useQueryWithPages({
    resourceName: 'core:arbitrum_l2_txn_batches',
    options: {
      placeholderData: generateListStub<'core:arbitrum_l2_txn_batches'>(
        ARBITRUM_L2_TXN_BATCHES_ITEM,
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

  const countersQuery = useApiQuery('core:arbitrum_l2_txn_batches_count', {
    queryOptions: {
      placeholderData: 5231746,
    },
  });

  const content = data?.items ? (
    <>
      <Box hideFrom="lg">
        <ArbitrumL2TxnBatchesList items={ data.items } isLoading={ isPlaceholderData } resetKey={ queryHash }/>
      </Box>
      <Box hideBelow="lg">
        <ArbitrumL2TxnBatchesTable
          items={ data.items }
          top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          isLoading={ isPlaceholderData }
          resetKey={ queryHash }
        />
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

export default ArbitrumL2TxnBatches;
