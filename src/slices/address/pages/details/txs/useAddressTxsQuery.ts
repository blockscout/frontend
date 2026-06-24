// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import type { AddressFromToFilter } from 'src/slices/address/types/api';
import { AddressFromToFilterValues } from 'src/slices/address/types/api';
import type { TransactionsSorting, TransactionsSortingField, TransactionsSortingValue } from 'src/slices/tx/types/api';

import { SORT_OPTIONS } from 'src/slices/tx/hooks/useTxsSort';
import { TX_ITEM } from 'src/slices/tx/stubs/tx';

import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';
import getFilterValueFromQuery from 'src/shared/router/get-filter-value-from-query';
import getSortParamsFromValue from 'src/shared/sort/get-sort-params-from-value';
import getSortValueFromQuery from 'src/shared/sort/get-sort-value-from-query';

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
    resourceName: 'core:address_txs',
    pathParams: { hash: addressHash },
    filters: { filter: filterValue },
    sorting: getSortParamsFromValue<TransactionsSortingValue, TransactionsSortingField, TransactionsSorting['order']>(sort),
    options: {
      enabled: enabled,
      placeholderData: generateListStub<'core:address_txs'>(TX_ITEM, 50, { next_page_params: {
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
