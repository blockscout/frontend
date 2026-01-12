import { Box } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { INTERCHAIN_STATS_COMMON, INTERCHAIN_TRANSFER } from 'stubs/interchainIndexer';
import { generateListStub } from 'stubs/utils';
import { Skeleton } from 'toolkit/chakra/skeleton';
import DataListDisplay from 'ui/shared/DataListDisplay';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';

import TokenTransfersCrossChainListItem from './TokenTransfersCrossChainListItem';
import TokenTransfersCrossChainTable from './TokenTransfersCrossChainTable';
import { getItemKey } from './utils';

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

  const content = data?.items ? (
    <>
      <Box hideFrom="lg">
        { data.items.map((item, index) => (
          <TokenTransfersCrossChainListItem
            key={ getItemKey(item, isPlaceholderData ? index : undefined) }
            data={ item }
            isLoading={ isPlaceholderData }
          />
        )) }
      </Box>
      <Box hideBelow="lg">
        <TokenTransfersCrossChainTable data={ data.items } isLoading={ isPlaceholderData }/>
      </Box>
    </>
  ) : null;

  const actionBarText = (
    <Skeleton loading={ statsQuery.isPlaceholderData || isPlaceholderData }>
      A total of { Number(statsQuery.data?.total_transfers).toLocaleString() } cross-chain token transfers found
    </Skeleton>
  );

  const actionBar = <StickyPaginationWithText text={ actionBarText } pagination={ pagination }/>;

  return (
    <DataListDisplay
      isError={ isError }
      itemsNum={ data?.items.length }
      emptyText="There are no cross-chain token transfers."
      emptyStateProps={{
        term: 'token transfer',
      }}
      actionBar={ actionBar }
    >
      { content }
    </DataListDisplay>
  );
};

export default React.memo(TokenTransfersCrossChain);
