// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { AddressFromToFilter } from 'src/slices/address/types/api';
import { AddressFromToFilterValues } from 'src/slices/address/types/api';
import type { TransactionsSortingValue } from 'src/slices/tx/types/api';

import { SORT_OPTIONS } from 'src/slices/tx/hooks/useTxsSort';
import { TX_ITEM } from 'src/slices/tx/stubs/tx';

import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';
import getFilterValueFromQuery from 'src/shared/router/get-filter-value-from-query';
import getSortValueFromQuery from 'src/shared/sort/get-sort-value-from-query';

const getFilterValue = (getFilterValueFromQuery<AddressFromToFilter>).bind(null, AddressFromToFilterValues);

interface Props {
  addressHash: string;
  enabled: boolean;
  isMultichain?: boolean;
  chainIds?: Array<string>;
}

export default function useAddressTxsQuery({ addressHash, enabled, isMultichain, chainIds }: Props) {
  const query = useQueryWithPages({
    resourceName: 'core:address_txs',
    pathParams: { hash: addressHash },
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

  const filterValue = getFilterValue(query.filters.filter);
  const sort = getSortValueFromQuery<TransactionsSortingValue>({ ...query.sorting }, SORT_OPTIONS) ?? 'default';

  const { onFilterChange: onQueryFilterChange } = query;
  const onFilterChange = React.useCallback((val: string | Array<string>) => {
    onQueryFilterChange({ filter: getFilterValue(val) });
  }, [ onQueryFilterChange ]);

  return React.useMemo(() => ({
    query,
    filterValue,
    onFilterChange,
    sort,
  }), [ query, filterValue, onFilterChange, sort ]);
}
