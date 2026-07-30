// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { TxQuery } from 'src/slices/tx/hooks/useTxQuery';

import DataList from 'src/shared/lists/DataList';
import type { QueryWithPagesResult } from 'src/shared/pagination/useQueryWithPages';

import TokenTransfersCrossChainList from '../../components/token-transfers/TokenTransfersCrossChainList';
import TokenTransfersCrossChainTable from '../../components/token-transfers/TokenTransfersCrossChainTable';

interface Props {
  txQuery: TxQuery;
  crossChainQuery: QueryWithPagesResult<'interchainIndexer:tx_transfers'>;
  isLoading?: boolean;
  tableTop?: number;
}

const TxTokenTransferCrossChain = ({ txQuery, crossChainQuery, isLoading, tableTop }: Props) => {
  const content = crossChainQuery.data?.items ? (
    <>
      <Box hideFrom="lg">
        <TokenTransfersCrossChainList
          items={ crossChainQuery.data.items }
          isLoading={ isLoading || crossChainQuery.isPlaceholderData }
          resetKey={ crossChainQuery.queryHash }
        />
      </Box>
      <Box hideBelow="lg">
        <TokenTransfersCrossChainTable
          data={ crossChainQuery.data.items }
          isLoading={ isLoading || crossChainQuery.isPlaceholderData }
          top={ tableTop }
          resetKey={ crossChainQuery.queryHash }
        />
      </Box>
    </>
  ) : null;

  return (
    <DataList
      isError={ txQuery.isError || crossChainQuery.isError }
      itemsNum={ crossChainQuery.data?.items.length }
      emptyText="There are no cross-chain token transfers."
      emptyStateProps={{
        term: 'token transfer',
      }}
    >
      { content }
    </DataList>
  );
};

export default React.memo(TxTokenTransferCrossChain);
