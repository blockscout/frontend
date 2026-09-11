// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { AddressFromToFilter } from 'src/slices/address/types/api';
import type { TxsSocketType } from 'src/slices/tx/types/socket';

import useTxsSort from 'src/slices/tx/hooks/useTxsSort';

import type { ApiPaginatedQueryResult } from 'src/shared/pagination/useApiPaginatedQuery';

import TxsContent from './TxsContent';

type Props = {
  query: ApiPaginatedQueryResult<'core:txs'> |
    ApiPaginatedQueryResult<'core:txs_watchlist'> |
    ApiPaginatedQueryResult<'core:block_txs'>;
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
  const { data, isError, setSortByValue, sorting } = useTxsSort(query);

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
      isInitialLoading={ query.isInitialLoading }
      isTransitioning={ query.isTransitioning }
      isError={ isError }
      setSorting={ setSortByValue }
      sort={ sorting }
      pagination={ query.pagination }
      resetKey={ query.queryHash }
    />
  );
};

export default TxsWithFrontendSorting;
