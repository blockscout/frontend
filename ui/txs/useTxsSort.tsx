import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { Transaction, TransactionsSortingValue, TxsResponse } from 'types/api/transaction';

import type { ResourceError } from 'lib/api/resources';
import compareBns from 'lib/bigint/compareBns';
import * as cookies from 'lib/cookies';
import type { Option } from 'ui/shared/sort/Sort';

export const SORT_OPTIONS: Array<Option<TransactionsSortingValue>> = [
  { title: 'Default', id: undefined },
  { title: 'Value ascending', id: 'value-asc' },
  { title: 'Value descending', id: 'value-desc' },
  { title: 'Fee ascending', id: 'fee-asc' },
  { title: 'Fee descending', id: 'fee-desc' },
];

type SortingValue = TransactionsSortingValue | undefined;

type HookResult = UseQueryResult<TxsResponse, ResourceError<unknown>> & {
  sorting: SortingValue;
  setSortByValue: (value: SortingValue) => void;
}

const sortTxs = (sorting: SortingValue) => (tx1: Transaction, tx2: Transaction) => {
  switch (sorting) {
    case 'value-desc':
      return compareBns(tx1.value, tx2.value);
    case 'value-asc':
      return compareBns(tx2.value, tx1.value);
    case 'fee-desc':
      return compareBns(tx1.fee.value || 0, tx2.fee.value || 0);
    case 'fee-asc':
      return compareBns(tx2.fee.value || 0, tx1.fee.value || 0);
    default:
      return 0;
  }
};

export default function useTxsSort(
  queryResult: UseQueryResult<TxsResponse, ResourceError<unknown>>,
): HookResult {

  const [ sorting, setSorting ] = React.useState<SortingValue>(cookies.get(cookies.NAMES.TXS_SORT) as SortingValue);

  const setSortByValue = React.useCallback((value: SortingValue) => {
    setSorting((prevVal: SortingValue) => {
      let newVal: SortingValue = undefined;
      if (value !== prevVal) {
        newVal = value as SortingValue;
      }
      cookies.set(cookies.NAMES.TXS_SORT, newVal ? newVal : '');
      return newVal;
    });
  }, []);

  return React.useMemo(() => {
    if (queryResult.isError || queryResult.isPending) {
      return { ...queryResult, setSortByValue, sorting };
    }

    return {
      ...queryResult,
      data: { ...queryResult.data, items: queryResult.data.items.slice().sort(sortTxs(sorting)) },
      setSortByValue,
      sorting,
    };
  }, [ queryResult, setSortByValue, sorting ]);

}
