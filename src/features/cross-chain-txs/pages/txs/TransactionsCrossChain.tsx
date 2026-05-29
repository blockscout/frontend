// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import StickyPaginationWithText from 'src/shared/pagination/StickyPaginationWithText';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

import TransactionsCrossChainContent from '../../components/txs/TransactionsCrossChainContent';
import { INTERCHAIN_MESSAGE, INTERCHAIN_STATS_COMMON } from '../../stubs/messages';
import TransactionsCrossChainStats from './TransactionsCrossChainStats';

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

  const actionBarText = (
    <Skeleton loading={ statsQuery.isPlaceholderData || isPlaceholderData }>
      A total of { Number(statsQuery.data?.total_messages).toLocaleString() } cross-chain transactions found
    </Skeleton>
  );

  const actionBar = <StickyPaginationWithText text={ actionBarText } pagination={ pagination }/>;

  return (
    <>
      <TransactionsCrossChainStats/>
      <TransactionsCrossChainContent
        items={ data?.items }
        isLoading={ isPlaceholderData }
        pagination={ pagination }
        isError={ isError }
        actionBar={ actionBar }
      />
    </>
  );
};

export default React.memo(TransactionsCrossChain);
