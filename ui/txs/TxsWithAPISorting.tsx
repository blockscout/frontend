import React from 'react';

import type { AddressFromToFilter } from 'types/api/address';
import type { TransactionsSortingValue } from 'types/api/transaction';

import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';
import getSortParamsFromValue from 'ui/shared/sort/getSortParamsFromValue';

import TxsContent from './TxsContent';

type Props = {

  query: QueryWithPagesResult<'address_txs'>;
  showBlockInfo?: boolean;
  showSocketInfo?: boolean;
  socketInfoAlert?: string;
  socketInfoNum?: number;
  currentAddress?: string;
  filter?: React.ReactNode;
  filterValue?: AddressFromToFilter;
  enableTimeIncrement?: boolean;
  top?: number;
  sorting: TransactionsSortingValue | undefined;
  setSort: (value?: TransactionsSortingValue) => void;
};

const TxsWithAPISorting = ({
  filter,
  filterValue,
  query,
  showBlockInfo = true,
  showSocketInfo = true,
  socketInfoAlert,
  socketInfoNum,
  currentAddress,
  enableTimeIncrement,
  top,
  sorting,
  setSort,
}: Props) => {

  const handleSortChange = React.useCallback((value?: TransactionsSortingValue) => {
    setSort(value);
    query.onSortingChange(getSortParamsFromValue(value));
  }, [ setSort, query ]);

  return (
    <TxsContent
      filter={ filter }
      filterValue={ filterValue }
      showBlockInfo={ showBlockInfo }
      showSocketInfo={ showSocketInfo }
      socketInfoAlert={ socketInfoAlert }
      socketInfoNum={ socketInfoNum }
      currentAddress={ currentAddress }
      enableTimeIncrement={ enableTimeIncrement }
      top={ top }
      items={ query.data?.items }
      isPlaceholderData={ query.isPlaceholderData }
      isError={ query.isError }
      setSorting={ handleSortChange }
      sort={ sorting }
      query={ query }
    />
  );
};

export default TxsWithAPISorting;
