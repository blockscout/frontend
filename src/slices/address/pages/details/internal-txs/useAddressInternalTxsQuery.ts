// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import type { ExternalChainExtended } from 'src/shared/external-chains/types';
import { AddressFromToFilterValues, type AddressFromToFilter } from 'src/slices/address/types/api';

import { INTERNAL_TX } from 'src/slices/internal-tx/stubs';

import useApiPaginatedQuery from 'src/shared/pagination/useApiPaginatedQuery';
import { generateListStub } from 'src/shared/pagination/utils';
import getFilterValueFromQuery from 'src/shared/router/get-filter-value-from-query';
import getQueryParamString from 'src/shared/router/get-query-param-string';

const getFilterValue = (getFilterValueFromQuery<AddressFromToFilter>).bind(null, AddressFromToFilterValues);

interface Props {
  enabled: boolean;
  chain?: ExternalChainExtended;
}

export default function useAddressInternalTxsQuery({ enabled, chain }: Props) {
  const router = useRouter();
  const hash = getQueryParamString(router.query.hash);

  const query = useApiPaginatedQuery({
    resourceName: 'core:address_internal_txs',
    pathParams: { hash },
    options: {
      enabled,
      placeholderData: generateListStub<'core:address_internal_txs'>(
        INTERNAL_TX,
        50,
        {
          next_page_params: {
            block_number: 8987561,
            index: 2,
            items_count: 50,
            transaction_index: 67,
          },
          meta: {
            message: null,
            status: 1,
          },
        },
      ),
    },
    chain,
  });

  const filterValue = getFilterValue(query.filters.filter);

  const { onFilterChange: onQueryFilterChange } = query;
  const onFilterChange = React.useCallback((val: string | Array<string>) => {
    onQueryFilterChange({ filter: getFilterValue(val) });
  }, [ onQueryFilterChange ]);

  return React.useMemo(() => ({
    hash,
    query,
    filterValue,
    onFilterChange,
  }), [ query, filterValue, onFilterChange, hash ]);
}
