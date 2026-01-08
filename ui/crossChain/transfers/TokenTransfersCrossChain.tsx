import { Box } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import { INTERCHAIN_TRANSFER } from 'stubs/interchainIndexer';
import { generateListStub } from 'stubs/utils';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

import TokenTransfersCrossChainListItem from './TokenTransfersCrossChainListItem';
import TokenTransfersCrossChainTable from './TokenTransfersCrossChainTable';
import { getItemKey } from './utils';

const TokenTransfersCrossChain = () => {
  const isMobile = useIsMobile();
  const { data, isPlaceholderData, isError, pagination } = useQueryWithPages({
    resourceName: 'interchainIndexer:transfers',
    options: {
      placeholderData: generateListStub<'interchainIndexer:transfers'>(INTERCHAIN_TRANSFER, 50, { next_page_params: { page_token: 'token' } }),
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

  const actionBar = (!isMobile || pagination.isVisible) && (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  );

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
