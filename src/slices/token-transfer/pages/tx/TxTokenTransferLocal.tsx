// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import TokenTransfersTable from 'src/slices/token-transfer/components/table/TokenTransfersTable';
import type { TokenTransferColumnsState } from 'src/slices/token-transfer/hooks/useTokenTransferColumns';
import type { TxQuery } from 'src/slices/tx/hooks/useTxQuery';

import DataList from 'src/shared/lists/DataList';
import type { ApiPaginatedQueryResult } from 'src/shared/pagination/useApiPaginatedQuery';

interface Props {
  txQuery: TxQuery;
  tokenTransferQuery: ApiPaginatedQueryResult<'core:tx_token_transfers'>;
  tokenTransferFilter?: (data: schemas['TokenTransfer']) => boolean;
  numActiveFilters: number;
  columnsState: TokenTransferColumnsState;
}

const TxTokenTransferLocal = ({ txQuery, tokenTransferQuery, tokenTransferFilter, numActiveFilters, columnsState }: Props) => {
  const { isInitialLoading, isTransitioning } = tokenTransferQuery;

  let items: Array<schemas['TokenTransfer']> = [];

  if (tokenTransferQuery.data?.items) {
    if (isInitialLoading) {
      items = tokenTransferQuery.data?.items;
    } else {
      items = tokenTransferFilter ? tokenTransferQuery.data.items.filter(tokenTransferFilter) : tokenTransferQuery.data.items;
    }
  }

  const content = tokenTransferQuery.data?.items ? (
    <TokenTransfersTable
      surface="tx"
      columns={ columnsState.columns }
      items={ items }
      isLoading={ isInitialLoading }
      resetKey={ tokenTransferQuery.queryHash }
    />
  ) : null;

  return (
    <DataList
      isError={ txQuery.isError || tokenTransferQuery.isError }
      itemsNum={ items.length }
      emptyText="There are no token transfers."
      hasActiveFilters={ Boolean(numActiveFilters) }
      isTransitioning={ isTransitioning }
      emptyStateProps={{
        term: 'token transfer',
      }}
    >
      { content }
    </DataList>
  );
};

export default React.memo(TxTokenTransferLocal);
