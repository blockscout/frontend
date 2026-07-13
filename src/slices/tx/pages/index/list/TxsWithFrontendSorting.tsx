// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { AddressFromToFilter } from 'src/slices/address/types/api';
import type { TxsSocketType } from 'src/slices/tx/types/socket';

import useTxsSort from 'src/slices/tx/hooks/useTxsSort';

import type { QueryWithPagesResult } from 'src/shared/pagination/useQueryWithPages';

import TxsContent from './TxsContent';

type Props = {
  query: QueryWithPagesResult<'core:txs'> |
    QueryWithPagesResult<'core:txs_watchlist'> |
    QueryWithPagesResult<'core:block_txs'>;
  showBlockInfo?: boolean;
  socketType?: TxsSocketType;
  currentAddress?: string;
  filter?: React.ReactNode;
  filterValue?: AddressFromToFilter;
  enableTimeIncrement?: boolean;
  top?: number;
};

const TxsWithFrontendSorting = ({
  filter,
  filterValue,
  query,
  showBlockInfo = true,
  socketType,
  currentAddress,
  enableTimeIncrement,
  top,
}: Props) => {
  const { data, isPlaceholderData, isError, setSortByValue, sorting } = useTxsSort(query);

  return (
    <TxsContent
      filter={ filter }
      filterValue={ filterValue }
      showBlockInfo={ showBlockInfo }
      socketType={ socketType }
      currentAddress={ currentAddress }
      enableTimeIncrement={ enableTimeIncrement }
      top={ top }
      items={ data?.items }
      isPlaceholderData={ isPlaceholderData }
      isError={ isError }
      setSorting={ setSortByValue }
      sort={ sorting }
      pagination={ query.pagination }
      resetKey={ query.queryHash }
    />
  );
};

export default TxsWithFrontendSorting;
