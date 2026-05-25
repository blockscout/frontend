// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { TokenTransfer } from 'client/slices/token-transfer/types/api';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'client/shell/page/action-bar/ActionBar';

import TokenTransferList from 'client/slices/token-transfer/components/list/TokenTransferList';
import TokenTransferTable from 'client/slices/token-transfer/components/list/TokenTransferTable';
import type { TxQuery } from 'client/slices/tx/hooks/useTxQuery';

import DataList from 'client/shared/lists/DataList';
import type { QueryWithPagesResult } from 'client/shared/pagination/useQueryWithPages';

interface Props {
  txQuery: TxQuery;
  tokenTransferQuery: QueryWithPagesResult<'general:tx_token_transfers'>;
  tokenTransferFilter?: (data: TokenTransfer) => boolean;
  numActiveFilters: number;
  tableTop?: number;
}

const TxTokenTransferLocal = ({ txQuery, tokenTransferQuery, tokenTransferFilter, numActiveFilters, tableTop }: Props) => {

  let items: Array<TokenTransfer> = [];

  if (tokenTransferQuery.data?.items) {
    if (tokenTransferQuery.isPlaceholderData) {
      items = tokenTransferQuery.data?.items;
    } else {
      items = tokenTransferFilter ? tokenTransferQuery.data.items.filter(tokenTransferFilter) : tokenTransferQuery.data.items;
    }
  }

  const content = tokenTransferQuery.data?.items ? (
    <>
      <Box hideBelow="lg">
        <TokenTransferTable data={ items } top={ tableTop ?? ACTION_BAR_HEIGHT_DESKTOP } isLoading={ tokenTransferQuery.isPlaceholderData }/>
      </Box>
      <Box hideFrom="lg">
        <TokenTransferList data={ items } isLoading={ tokenTransferQuery.isPlaceholderData }/>
      </Box>
    </>
  ) : null;

  return (
    <DataList
      isError={ txQuery.isError || tokenTransferQuery.isError }
      itemsNum={ items.length }
      emptyText="There are no token transfers."
      hasActiveFilters={ Boolean(numActiveFilters) }
      emptyStateProps={{
        term: 'token transfer',
      }}
    >
      { content }
    </DataList>
  );
};

export default React.memo(TxTokenTransferLocal);
