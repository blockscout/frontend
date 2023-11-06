import { Hide, Show, Skeleton, Text } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { nbsp } from 'lib/html-entities';
import { L2_TXN_BATCHES_ITEM } from 'stubs/L2';
import { generateListStub } from 'stubs/utils';
import TxnBatchesListItem from 'ui/l2TxnBatches/TxnBatchesListItem';
import TxnBatchesTable from 'ui/l2TxnBatches/TxnBatchesTable';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';

const L2TxnBatches = () => {
  const { data, isError, isPlaceholderData, pagination } = useQueryWithPages({
    resourceName: 'l2_txn_batches',
    options: {
      placeholderData: generateListStub<'l2_txn_batches'>(
        L2_TXN_BATCHES_ITEM,
        50,
        {
          next_page_params: {
            items_count: 50,
            block_number: 9045200,
          },
        },
      ),
    },
  });

  const countersQuery = useApiQuery('l2_txn_batches_count', {
    queryOptions: {
      placeholderData: 5231746,
    },
  });

  const content = data?.items ? (
    <>
      <Show below="lg" ssr={ false }>
        { data.items.map(((item, index) => (
          <TxnBatchesListItem
            key={ item.l2_block_number + (isPlaceholderData ? String(index) : '') }
            item={ item }
            isLoading={ isPlaceholderData }
          />
        ))) }
      </Show>
      <Hide below="lg" ssr={ false }><TxnBatchesTable items={ data.items } top={ pagination.isVisible ? 80 : 0 } isLoading={ isPlaceholderData }/></Hide>
    </>
  ) : null;

  const text = (() => {
    if (countersQuery.isError || isError || !data?.items.length) {
      return null;
    }

    return (
      <Skeleton isLoaded={ !countersQuery.isPlaceholderData && !isPlaceholderData } display="flex" flexWrap="wrap">
        Tx batch (L2 block)
        <Text fontWeight={ 600 } whiteSpace="pre"> #{ data.items[0].l2_block_number } </Text>to
        <Text fontWeight={ 600 } whiteSpace="pre"> #{ data.items[data.items.length - 1].l2_block_number } </Text>
        (total of { countersQuery.data?.toLocaleString() } batches)
      </Skeleton>
    );
  })();

  const actionBar = <StickyPaginationWithText text={ text } pagination={ pagination }/>;

  return (
    <>
      <PageTitle title={ `Tx batches (L2${ nbsp }blocks)` } withTextAd/>
      <DataListDisplay
        isError={ isError }
        items={ data?.items }
        emptyText="There are no tx batches."
        content={ content }
        actionBar={ actionBar }
      />
    </>
  );
};

export default L2TxnBatches;
