// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import StickyPaginationWithText from 'src/shared/pagination/StickyPaginationWithText';
import useApiPaginatedQuery from 'src/shared/pagination/useApiPaginatedQuery';
import { generateListStub } from 'src/shared/pagination/utils';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

import TokenTransfersCrossChainContent from '../../components/token-transfers/TokenTransfersCrossChainContent';
import { useCrossChainCountersQuery } from '../../hooks/useCrossChainCountersQuery';
import { INTERCHAIN_TRANSFER } from '../../stubs/messages';

const TokenTransfersCrossChain = () => {
  const { data, isInitialLoading, isTransitioning, isError, pagination, queryHash } = useApiPaginatedQuery({
    resourceName: 'interchainIndexer:transfers',
    options: {
      placeholderData: generateListStub<'interchainIndexer:transfers'>(INTERCHAIN_TRANSFER, 50, { next_page_params: { page_token: 'token' } }),
    },
  });
  const countersQuery = useCrossChainCountersQuery();
  const total = countersQuery.data?.totalInterchainTransfers;

  const actionBarText = total !== undefined ? (
    <Skeleton loading={ countersQuery.isPlaceholderData || isInitialLoading }>
      A total of { Number(total).toLocaleString() } cross-chain token transfers found
    </Skeleton>
  ) : null;

  const actionBar = <StickyPaginationWithText text={ actionBarText } pagination={ pagination }/>;

  return (
    <TokenTransfersCrossChainContent
      items={ data?.items }
      isLoading={ isInitialLoading }
      isTransitioning={ isTransitioning }
      pagination={ pagination }
      isError={ isError }
      itemsNum={ data?.items.length }
      actionBar={ actionBar }
      resetKey={ queryHash }
    />
  );
};

export default React.memo(TokenTransfersCrossChain);
