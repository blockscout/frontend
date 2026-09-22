// SPDX-License-Identifier: LicenseRef-Blockscout

import { Text } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';
import PageTitle from 'src/shell/page/title/PageTitle';

import OptimisticL2TxnBatchesTable from 'src/features/rollup/optimism/pages/batches/OptimisticL2TxnBatchesTable';
import { L2_TXN_BATCHES_ITEM } from 'src/features/rollup/optimism/stubs';

import DataList from 'src/shared/lists/DataList';
import StickyPaginationWithText from 'src/shared/pagination/StickyPaginationWithText';
import useApiPaginatedQuery from 'src/shared/pagination/useApiPaginatedQuery';
import { generateListStub } from 'src/shared/pagination/utils';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableContainerScrollable } from 'src/toolkit/chakra/table';

const OptimisticL2TxnBatches = () => {
  const { data, isError, isInitialLoading, isTransitioning, pagination, queryHash } = useApiPaginatedQuery({
    resourceName: 'core:optimistic_l2_txn_batches',
    options: {
      placeholderData: generateListStub<'core:optimistic_l2_txn_batches'>(
        L2_TXN_BATCHES_ITEM,
        50,
        {
          next_page_params: {
            items_count: 50,
            id: 9045200,
          },
        },
      ),
    },
  });

  const countersQuery = useApiQuery('core:optimistic_l2_txn_batches_count', {
    queryOptions: {
      placeholderData: 5231746,
    },
  });

  const content = data?.items ? (
    <TableContainerScrollable>
      <OptimisticL2TxnBatchesTable
        items={ data.items }
        top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
        isLoading={ isInitialLoading }
        resetKey={ queryHash }
      />
    </TableContainerScrollable>
  ) : null;

  const text = (() => {
    if (countersQuery.isError || isError || !data?.items.length) {
      return null;
    }

    return (
      <Skeleton loading={ countersQuery.isPlaceholderData || isInitialLoading } display="flex" flexWrap="wrap">
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
        itemsNum={ data?.items?.length }
        emptyText="There are no txn batches."
        actionBar={ actionBar }
        isTransitioning={ isTransitioning }
      >
        { content }
      </DataList>
    </>
  );
};

export default OptimisticL2TxnBatches;
