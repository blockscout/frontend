// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { AddressFromToFilter } from 'src/slices/address/types/api';
import type { TransactionsSortingValue } from 'src/slices/tx/types/api';
import type { TxsSocketType } from 'src/slices/tx/types/socket';

import type { QueryWithPagesResult } from 'src/shared/pagination/useQueryWithPages';
import getSortParamsFromValue from 'src/shared/sort/get-sort-params-from-value';

import TxsContent from './TxsContent';

interface Props {

  query: QueryWithPagesResult<'core:address_txs'>;
  showBlockInfo?: boolean;
  socketType?: TxsSocketType;
  currentAddress?: string;
  filter?: React.ReactNode;
  filterValue?: AddressFromToFilter;
  enableTimeIncrement?: boolean;
  top?: number;
  sorting: TransactionsSortingValue;
  showTableView?: boolean;
};

const TxsWithApiSorting = ({
  filter,
  filterValue,
  query,
  showBlockInfo = true,
  socketType,
  currentAddress,
  enableTimeIncrement,
  top,
  sorting,
  showTableView,
}: Props) => {
  const { onSortingChange } = query;
  const handleSortChange = React.useCallback((value: TransactionsSortingValue) => {
    onSortingChange(getSortParamsFromValue(value));
  }, [ onSortingChange ]);

  return (
    <TxsContent
      filter={ filter }
      filterValue={ filterValue }
      showBlockInfo={ showBlockInfo }
      socketType={ socketType }
      currentAddress={ currentAddress }
      enableTimeIncrement={ enableTimeIncrement }
      top={ top }
      items={ query.data?.items }
      isInitialLoading={ query.isInitialLoading }
      isTransitioning={ query.isTransitioning }
      isError={ query.isError }
      setSorting={ handleSortChange }
      sort={ sorting }
      pagination={ query.pagination }
      showTableView={ showTableView }
      resetKey={ query.queryHash }
    />
  );
};

export default TxsWithApiSorting;
