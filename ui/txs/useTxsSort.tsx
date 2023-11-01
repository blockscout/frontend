import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { TxsResponse } from 'types/api/transaction';
import type { Sort } from 'types/client/txs-sort';

import type { ResourceError } from 'lib/api/resources';
import * as cookies from 'lib/cookies';
import sortTxs from 'lib/tx/sortTxs';

type HookResult = UseQueryResult<TxsResponse, ResourceError<unknown>> & {
  sorting: Sort;
  setSortByField: (field: 'val' | 'fee') => () => void;
  setSortByValue: (value: Sort | undefined) => void;
}

export default function useTxsSort(
  queryResult: UseQueryResult<TxsResponse, ResourceError<unknown>>,
): HookResult {

  const [ sorting, setSorting ] = React.useState<Sort>(cookies.get(cookies.NAMES.TXS_SORT) as Sort);

  const setSortByField = React.useCallback((field: 'val' | 'fee') => () => {
    if (queryResult.isPlaceholderData) {
      return;
    }

    setSorting((prevVal) => {
      let newVal: Sort = '';
      if (field === 'val') {
        if (prevVal === 'val-asc') {
          newVal = '';
        } else if (prevVal === 'val-desc') {
          newVal = 'val-asc';
        } else {
          newVal = 'val-desc';
        }
      }
      if (field === 'fee') {
        if (prevVal === 'fee-asc') {
          newVal = '';
        } else if (prevVal === 'fee-desc') {
          newVal = 'fee-asc';
        } else {
          newVal = 'fee-desc';
        }
      }
      cookies.set(cookies.NAMES.TXS_SORT, newVal);
      return newVal;
    });
  }, [ queryResult.isPlaceholderData ]);

  const setSortByValue = React.useCallback((value: Sort | undefined) => {
    setSorting((prevVal: Sort) => {
      let newVal: Sort = '';
      if (value !== prevVal) {
        newVal = value as Sort;
      }
      cookies.set(cookies.NAMES.TXS_SORT, newVal);
      return newVal;
    });
  }, []);

  return React.useMemo(() => {
    if (queryResult.isError || queryResult.isPending) {
      return { ...queryResult, setSortByField, setSortByValue, sorting };
    }

    return {
      ...queryResult,
      data: { ...queryResult.data, items: queryResult.data.items.slice().sort(sortTxs(sorting)) },
      setSortByField,
      setSortByValue,
      sorting,
    };
  }, [ queryResult, setSortByField, setSortByValue, sorting ]);

}
