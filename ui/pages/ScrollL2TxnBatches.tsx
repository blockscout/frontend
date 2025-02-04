import { Hide, Show, Text } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { SCROLL_L2_TXN_BATCH } from 'stubs/scrollL2';
import { generateListStub } from 'stubs/utils';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import Skeleton from 'ui/shared/chakra/Skeleton';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';
import ScrollL2TxnBatchesListItem from 'ui/txnBatches/scrollL2/ScrollL2TxnBatchesListItem';
import ScrollL2TxnBatchesTable from 'ui/txnBatches/scrollL2/ScrollL2TxnBatchesTable';

const ScrollL2TxnBatches = () => {
  const { data, isError, isPlaceholderData, pagination } = useQueryWithPages({
    resourceName: 'scroll_l2_txn_batches',
    options: {
      placeholderData: generateListStub<'scroll_l2_txn_batches'>(
        SCROLL_L2_TXN_BATCH,
        50,
        {
          next_page_params: {
            items_count: 50,
            number: 224,
          },
        },
      ),
    },
  });

  const countersQuery = useApiQuery('scroll_l2_txn_batches_count', {
    queryOptions: {
      placeholderData: 123456,
    },
  });

  const content = data?.items ? (
    <>
      <Show below="lg" ssr={ false }>
        { data.items.map(((item, index) => (
          <ScrollL2TxnBatchesListItem
            key={ item.number + (isPlaceholderData ? String(index) : '') }
            item={ item }
            isLoading={ isPlaceholderData }
          />
        ))) }
      </Show>
      <Hide below="lg" ssr={ false }>
        <ScrollL2TxnBatchesTable items={ data.items } top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 } isLoading={ isPlaceholderData }/>
      </Hide>
    </>
  ) : null;

  const text = (() => {
    if (countersQuery.isError || isError || !data?.items.length) {
      return null;
    }

    return (
      <Skeleton isLoaded={ !countersQuery.isPlaceholderData && !isPlaceholderData } display="flex" flexWrap="wrap">
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
      <DataListDisplay
        isError={ isError }
        items={ data?.items }
        emptyText="There are no txn batches."
        content={ content }
        actionBar={ actionBar }
      />
    </>
  );
};

export default ScrollL2TxnBatches;
