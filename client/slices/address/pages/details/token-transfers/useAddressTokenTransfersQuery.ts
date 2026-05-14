// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import type { AddressFromToFilter } from 'client/slices/address/types/api';
import { AddressFromToFilterValues } from 'client/slices/address/types/api';
import type { TokenType } from 'client/slices/token/types/api';
import { getTokenTypes } from 'client/slices/token/utils/token-types';

import { getTokenTransfersStub } from 'client/slices/token-transfer/stubs';

import getFilterValueFromQuery from 'client/shared/router/get-filter-value-from-query';
import getFilterValuesFromQuery from 'client/shared/router/get-filter-values-from-query';
import getQueryParamString from 'client/shared/router/get-query-param-string';

import multichainConfig from 'configs/multichain';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

export type Filters = {
  type: Array<TokenType>;
  filter: AddressFromToFilter | undefined;
};

const getAddressFilterValue = (getFilterValueFromQuery<AddressFromToFilter>).bind(null, AddressFromToFilterValues);

const getFilters = (query: Record<string, string | Array<string> | undefined>, chainIds?: Array<string>) => {
  const chainIdParam = getQueryParamString(query.chain_id);
  const filterParam = getQueryParamString(query.filter);
  const typeParam = getQueryParamString(query.type);

  const currentChainId = chainIdParam && chainIds?.includes(chainIdParam) ? chainIdParam : chainIds?.[0];
  const chainConfig = multichainConfig()?.chains.find(chain => chain.id === currentChainId);

  return {
    filter: getAddressFilterValue(filterParam),
    type: getFilterValuesFromQuery(
      Object.keys(getTokenTypes(false, chainConfig?.app_config)),
      typeParam,
    ) || [],
  };
};

interface Props {
  currentAddress: string;
  enabled?: boolean;
  isMultichain?: boolean;
  chainIds?: Array<string>;
}

export default function useAddressTokenTransfersQuery({ currentAddress, enabled, isMultichain, chainIds }: Props) {
  const router = useRouter();

  const [ filters, setFilters ] = React.useState<Filters>(getFilters(router.query, chainIds));

  React.useEffect(() => {
    if (enabled) {
      setFilters(getFilters(router.query, chainIds));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ enabled ]);

  const query = useQueryWithPages({
    resourceName: 'general:address_token_transfers',
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
    isMultichain,
    chainIds,
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
