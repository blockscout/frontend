// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import TokenTransferList from 'src/slices/token-transfer/components/list/TokenTransferList';
import TokenTransferTable from 'src/slices/token-transfer/components/list/TokenTransferTable';
import type { TxQuery } from 'src/slices/tx/hooks/useTxQuery';

import DataList from 'src/shared/lists/DataList';
import type { QueryWithPagesResult } from 'src/shared/pagination/useQueryWithPages';

interface Props {
  txQuery: TxQuery;
  tokenTransferQuery: QueryWithPagesResult<'core:tx_token_transfers'>;
  tokenTransferFilter?: (data: schemas['TokenTransfer']) => boolean;
  numActiveFilters: number;
  tableTop?: number;
}

const TxTokenTransferLocal = ({ txQuery, tokenTransferQuery, tokenTransferFilter, numActiveFilters, tableTop }: Props) => {

  let items: Array<schemas['TokenTransfer']> = [];

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
        <TokenTransferTable
          data={ items }
          top={ tableTop ?? ACTION_BAR_HEIGHT_DESKTOP }
          isLoading={ tokenTransferQuery.isPlaceholderData }
          resetKey={ tokenTransferQuery.queryHash }
        />
      </Box>
      <Box hideFrom="lg">
        <TokenTransferList data={ items } isLoading={ tokenTransferQuery.isPlaceholderData } resetKey={ tokenTransferQuery.queryHash }/>
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
