// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import type { AddressFromToFilter } from 'client/slices/address/types/api';
import { AddressFromToFilterValues } from 'client/slices/address/types/api';
import type { TransactionsSorting, TransactionsSortingField, TransactionsSortingValue } from 'client/slices/tx/types/api';

import { SORT_OPTIONS } from 'client/slices/tx/hooks/useTxsSort';
import { TX } from 'client/slices/tx/stubs/tx';

import getFilterValueFromQuery from 'client/shared/router/get-filter-value-from-query';

import { generateListStub } from 'stubs/utils';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import getSortParamsFromValue from 'ui/shared/sort/getSortParamsFromValue';
import getSortValueFromQuery from 'ui/shared/sort/getSortValueFromQuery';

const getFilterValue = (getFilterValueFromQuery<AddressFromToFilter>).bind(null, AddressFromToFilterValues);

interface Props {
  addressHash: string;
  enabled: boolean;
  isMultichain?: boolean;
  chainIds?: Array<string>;
}

export default function useAddressTxsQuery({ addressHash, enabled, isMultichain, chainIds }: Props) {
  const router = useRouter();

  const [ sort, setSort ] = React.useState<TransactionsSortingValue>(getSortValueFromQuery<TransactionsSortingValue>(router.query, SORT_OPTIONS) || 'default');

  const initialFilterValue = getFilterValue(router.query.filter);
  const [ filterValue, setFilterValue ] = React.useState<AddressFromToFilter>(initialFilterValue);

  const query = useQueryWithPages({
    resourceName: 'general:address_txs',
    pathParams: { hash: addressHash },
    filters: { filter: filterValue },
    sorting: getSortParamsFromValue<TransactionsSortingValue, TransactionsSortingField, TransactionsSorting['order']>(sort),
    options: {
      enabled: enabled,
      placeholderData: generateListStub<'general:address_txs'>(TX, 50, { next_page_params: {
        block_number: 9005713,
        index: 5,
        items_count: 50,
      } }),
    },
    isMultichain,
    chainIds,
  });

  const onFilterChange = React.useCallback((val: string | Array<string>) => {
    const newVal = getFilterValue(val);
    setFilterValue(newVal);
    query.onFilterChange({ filter: newVal });
  }, [ query ]);

  return React.useMemo(() => ({
    query,
    filterValue,
    setFilterValue,
    initialFilterValue,
    onFilterChange,
    sort,
    setSort,
  }), [ query, filterValue, initialFilterValue, setFilterValue, onFilterChange, sort, setSort ]);
}
