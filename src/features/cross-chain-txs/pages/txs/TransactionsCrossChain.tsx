// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import StickyPaginationWithText from 'src/shared/pagination/StickyPaginationWithText';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

import TransactionsCrossChainContent from '../../components/txs/TransactionsCrossChainContent';
import { useCrossChainCountersQuery } from '../../hooks/useCrossChainCountersQuery';
import { INTERCHAIN_MESSAGE } from '../../stubs/messages';
import TransactionsCrossChainStats from './TransactionsCrossChainStats';

const TransactionsCrossChain = () => {
  const { data, isPlaceholderData, isError, pagination, queryHash } = useQueryWithPages({
    resourceName: 'interchainIndexer:messages',
    options: {
      placeholderData: generateListStub<'interchainIndexer:messages'>(INTERCHAIN_MESSAGE, 50, { next_page_params: { page_token: 'token' } }),
    },
  });
  const countersQuery = useCrossChainCountersQuery();
  const total = countersQuery.data?.totalInterchainMessages;

  const actionBarText = total !== undefined ? (
    <Skeleton loading={ countersQuery.isPlaceholderData || isPlaceholderData }>
      A total of { Number(total).toLocaleString() } cross-chain transactions found
    </Skeleton>
  ) : null;

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
        resetKey={ queryHash }
      />
    </>
  );
};

export default React.memo(TransactionsCrossChain);
