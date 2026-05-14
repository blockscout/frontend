// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { AddressFromToFilter } from 'client/slices/address/types/api';
import type { TxsSocketType } from 'client/slices/tx/types/socket';

import useTxsSort from 'client/slices/tx/hooks/useTxsSort';

import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';

import TxsContent from './TxsContent';

type Props = {
  query: QueryWithPagesResult<'general:txs_validated' | 'general:txs_pending'> |
    QueryWithPagesResult<'general:txs_watchlist'> |
    QueryWithPagesResult<'general:block_txs'>;
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
    />
  );
};

export default TxsWithFrontendSorting;
