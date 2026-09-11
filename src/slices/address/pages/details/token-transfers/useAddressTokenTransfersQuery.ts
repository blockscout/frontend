// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import type { ClusterChainConfig } from 'src/features/multichain/types/client';
import type { AddressFromToFilter } from 'src/slices/address/types/api';
import { AddressFromToFilterValues } from 'src/slices/address/types/api';
import type { TokenType } from 'src/slices/token/types/api';
import { getTokenTypes } from 'src/slices/token/utils/token-types';

import { getTokenTransfersStub } from 'src/slices/token-transfer/stubs';

import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import getFilterValueFromQuery from 'src/shared/router/get-filter-value-from-query';
import getFilterValuesFromQuery from 'src/shared/router/get-filter-values-from-query';
import getQueryParamString from 'src/shared/router/get-query-param-string';

export type Filters = {
  type: Array<TokenType>;
  filter: AddressFromToFilter | undefined;
};

const getAddressFilterValue = (getFilterValueFromQuery<AddressFromToFilter>).bind(null, AddressFromToFilterValues);

const getFilters = (query: Record<string, string | Array<string> | undefined>, chain: ClusterChainConfig | undefined) => {
  const filterParam = getQueryParamString(query.filter);
  const typeParam = getQueryParamString(query.type);

  return {
    filter: getAddressFilterValue(filterParam),
    type: getFilterValuesFromQuery(
      Object.keys(getTokenTypes('all', chain?.app_config)),
      typeParam,
    ) || [],
  };
};

interface Props {
  currentAddress: string;
  enabled?: boolean;
  chain?: ClusterChainConfig;
}

export default function useAddressTokenTransfersQuery({ currentAddress, enabled, chain }: Props) {
  const router = useRouter();

  const [ filters, setFilters ] = React.useState<Filters>(getFilters(router.query, chain));

  React.useEffect(() => {
    if (enabled) {
      setFilters(getFilters(router.query, chain));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ enabled ]);

  const query = useQueryWithPages({
    resourceName: 'core:address_token_transfers',
    pathParams: { hash: currentAddress },
    filters,
    options: {
      enabled,
      placeholderData: getTokenTransfersStub(undefined, {
        block_number: 7793535,
        index: 46,
        items_count: 50,
      }),
    },
    chain,
  });

  const onTypeFilterChange = React.useCallback((nextValue: Array<TokenType>) => {
    query.onFilterChange({ ...filters, type: nextValue });
    setFilters((prevState) => ({ ...prevState, type: nextValue }));
  }, [ filters, query ]);

  const onAddressFilterChange = React.useCallback((nextValue: string) => {
    const filterVal = getAddressFilterValue(nextValue);
    query.onFilterChange({ ...filters, filter: filterVal });
    setFilters((prevState) => ({ ...prevState, filter: filterVal }));
  }, [ filters, query ]);

  return React.useMemo(() => ({
    query,
    filters,
    setFilters,
    onTypeFilterChange,
    onAddressFilterChange,
  }), [ query, filters, setFilters, onTypeFilterChange, onAddressFilterChange ]);
}
