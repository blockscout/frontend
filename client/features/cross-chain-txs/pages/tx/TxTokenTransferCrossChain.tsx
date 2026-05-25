// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { TxQuery } from 'client/slices/tx/hooks/useTxQuery';

import DataList from 'client/shared/lists/DataList';
import type { QueryWithPagesResult } from 'client/shared/pagination/useQueryWithPages';

import TokenTransfersCrossChainListItem from '../../components/token-transfers/TokenTransfersCrossChainListItem';
import TokenTransfersCrossChainTable from '../../components/token-transfers/TokenTransfersCrossChainTable';
import { getItemKey } from '../../components/token-transfers/utils';

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
        { crossChainQuery.data.items.map((item, index) => (
          <TokenTransfersCrossChainListItem
            key={ getItemKey(item, crossChainQuery.isPlaceholderData ? index : undefined) }
            data={ item }
            isLoading={ isLoading || crossChainQuery.isPlaceholderData }
          />
        )) }
      </Box>
      <Box hideBelow="lg">
        <TokenTransfersCrossChainTable
          data={ crossChainQuery.data.items }
          isLoading={ isLoading || crossChainQuery.isPlaceholderData }
          top={ tableTop }
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
