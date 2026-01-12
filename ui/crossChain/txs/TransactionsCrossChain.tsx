import { Box } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { INTERCHAIN_MESSAGE, INTERCHAIN_STATS_COMMON } from 'stubs/interchainIndexer';
import { generateListStub } from 'stubs/utils';
import { Skeleton } from 'toolkit/chakra/skeleton';
import DataListDisplay from 'ui/shared/DataListDisplay';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';

import TransactionsCrossChainListItem from './TransactionsCrossChainListItem';
import TransactionsCrossChainStats from './TransactionsCrossChainStats';
import TransactionsCrossChainTable from './TransactionsCrossChainTable';

const TransactionsCrossChain = () => {
  const { data, isPlaceholderData, isError, pagination } = useQueryWithPages({
    resourceName: 'interchainIndexer:messages',
    options: {
      placeholderData: generateListStub<'interchainIndexer:messages'>(INTERCHAIN_MESSAGE, 50, { next_page_params: { page_token: 'token' } }),
    },
  });
  const statsQuery = useApiQuery('interchainIndexer:stats_common', {
    queryOptions: {
      placeholderData: INTERCHAIN_STATS_COMMON,
    },
  });

  const content = data?.items ? (
    <>
      <Box hideFrom="lg">
        { data.items.map((item, index) => (
          <TransactionsCrossChainListItem
            key={ item.message_id + (isPlaceholderData ? index : '') }
            data={ item }
            isLoading={ isPlaceholderData }
          />
        )) }
      </Box>
      <Box hideBelow="lg">
        <TransactionsCrossChainTable data={ data.items } isLoading={ isPlaceholderData }/>
      </Box>
    </>
  ) : null;

  const actionBarText = (
    <Skeleton loading={ statsQuery.isPlaceholderData || isPlaceholderData }>
      A total of { Number(statsQuery.data?.total_messages).toLocaleString() } cross-chain transactions found
    </Skeleton>
  );

  const actionBar = <StickyPaginationWithText text={ actionBarText } pagination={ pagination }/>;

  return (
    <>
      <TransactionsCrossChainStats/>
      <DataListDisplay
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no cross-chain transactions."
        emptyStateProps={{
          term: 'transaction',
        }}
        actionBar={ actionBar }
      >
        { content }
      </DataListDisplay>
    </>
  );
};

export default React.memo(TransactionsCrossChain);
