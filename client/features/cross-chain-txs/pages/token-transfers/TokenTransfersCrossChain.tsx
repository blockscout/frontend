// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import useApiQuery from 'client/api/hooks/useApiQuery';

import { generateListStub } from 'client/shared/pagination/utils';

import { Skeleton } from 'toolkit/chakra/skeleton';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';

import TokenTransfersCrossChainContent from '../../components/token-transfers/TokenTransfersCrossChainContent';
import { INTERCHAIN_STATS_COMMON, INTERCHAIN_TRANSFER } from '../../stubs/messages';

const TokenTransfersCrossChain = () => {
  const { data, isPlaceholderData, isError, pagination } = useQueryWithPages({
    resourceName: 'interchainIndexer:transfers',
    options: {
      placeholderData: generateListStub<'interchainIndexer:transfers'>(INTERCHAIN_TRANSFER, 50, { next_page_params: { page_token: 'token' } }),
    },
  });
  const statsQuery = useApiQuery('interchainIndexer:stats_common', {
    queryOptions: {
      placeholderData: INTERCHAIN_STATS_COMMON,
    },
  });

  const actionBarText = (
    <Skeleton loading={ statsQuery.isPlaceholderData || isPlaceholderData }>
      A total of { Number(statsQuery.data?.total_transfers).toLocaleString() } cross-chain token transfers found
    </Skeleton>
  );

  const actionBar = <StickyPaginationWithText text={ actionBarText } pagination={ pagination }/>;

  return (
    <TokenTransfersCrossChainContent
      items={ data?.items }
      isLoading={ isPlaceholderData }
      pagination={ pagination }
      isError={ isError }
      itemsNum={ data?.items.length }
      actionBar={ actionBar }
    />
  );
};

export default React.memo(TokenTransfersCrossChain);
