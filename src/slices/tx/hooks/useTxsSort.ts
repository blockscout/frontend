// SPDX-License-Identifier: LicenseRef-Blockscout

import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { operations } from '@blockscout/api-types';
import type { TransactionsSortingValue } from 'src/slices/tx/types/api';

import type { ResourceError } from 'src/api/resources';

import * as cookies from 'src/shared/storage/cookies';

import type { SelectOption } from 'src/toolkit/chakra/select';

import sortTxs from '../utils/sort-txs';

export const SORT_OPTIONS: Array<SelectOption<TransactionsSortingValue>> = [
  { label: 'Default', value: 'default' },
  { label: 'Value ascending', value: 'value-asc' },
  { label: 'Value descending', value: 'value-desc' },
  { label: 'Fee ascending', value: 'fee-asc' },
  { label: 'Fee descending', value: 'fee-desc' },
  { label: 'Block number ascending', value: 'block_number-asc' },
];

type SortingValue = TransactionsSortingValue;

type HookResult = UseQueryResult<operations['TransactionController.transactions']['json'], ResourceError<unknown>> & {
  sorting: SortingValue;
  setSortByValue: (value: SortingValue) => void;
};

export default function useTxsSort(
  queryResult: UseQueryResult<operations['TransactionController.transactions']['json'], ResourceError<unknown>>,
): HookResult {

  const [ sorting, setSorting ] = React.useState<SortingValue>((cookies.get(cookies.NAMES.TXS_SORT) as SortingValue | undefined) ?? 'default');

  const setSortByValue = React.useCallback((value: SortingValue) => {
    setSorting((prevVal: SortingValue) => {
      let newVal: SortingValue = 'default';
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
