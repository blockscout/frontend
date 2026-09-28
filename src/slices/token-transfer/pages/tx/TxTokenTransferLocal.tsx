// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import TokenTransferTable from 'src/slices/token-transfer/components/list/TokenTransferTable';
import type { TxQuery } from 'src/slices/tx/hooks/useTxQuery';

import DataList from 'src/shared/lists/DataList';
import type { ApiPaginatedQueryResult } from 'src/shared/pagination/useApiPaginatedQuery';

import { TableContainerScrollable } from 'src/toolkit/chakra/table';

interface Props {
  txQuery: TxQuery;
  tokenTransferQuery: ApiPaginatedQueryResult<'core:tx_token_transfers'>;
  tokenTransferFilter?: (data: schemas['TokenTransfer']) => boolean;
  numActiveFilters: number;
  tableTop?: number;
}

const TxTokenTransferLocal = ({ txQuery, tokenTransferQuery, tokenTransferFilter, numActiveFilters, tableTop }: Props) => {
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
    <TableContainerScrollable>
      <TokenTransferTable
        data={ items }
        top={ tableTop ?? ACTION_BAR_HEIGHT_DESKTOP }
        isLoading={ isInitialLoading }
        resetKey={ tokenTransferQuery.queryHash }
      />
    </TableContainerScrollable>
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
