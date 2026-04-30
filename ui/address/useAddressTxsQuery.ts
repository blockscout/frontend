import { useRouter } from 'next/router';
import React from 'react';

import type { TransactionsSorting, TransactionsSortingField, TransactionsSortingValue } from 'client/slices/tx/types/api';
import type { AddressFromToFilter } from 'types/api/address';
import { AddressFromToFilterValues } from 'types/api/address';

import getFilterValueFromQuery from 'client/shared/router/get-filter-value-from-query';
import { TX } from 'client/slices/tx/stubs/tx';
import { generateListStub } from 'stubs/utils';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import getSortParamsFromValue from 'ui/shared/sort/getSortParamsFromValue';
import getSortValueFromQuery from 'ui/shared/sort/getSortValueFromQuery';
import { SORT_OPTIONS } from 'ui/txs/useTxsSort';

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
