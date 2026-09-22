// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ClusterChainConfig } from 'src/features/multichain/types/client';
import type { AddressFromToFilter } from 'src/slices/address/types/api';
import { AddressFromToFilterValues } from 'src/slices/address/types/api';
import type { TokenType } from 'src/slices/token/types/api';
import { getTokenTypes } from 'src/slices/token/utils/token-types';

import type { PaginationFilters } from 'src/api/resources';

import { getTokenTransfersStub } from 'src/slices/token-transfer/stubs';

import useApiPaginatedQuery from 'src/shared/pagination/useApiPaginatedQuery';
import getFilterValueFromQuery from 'src/shared/router/get-filter-value-from-query';
import getFilterValuesFromQuery from 'src/shared/router/get-filter-values-from-query';

export type Filters = {
  type: Array<TokenType>;
  filter: AddressFromToFilter | undefined;
};

const getAddressFilterValue = (getFilterValueFromQuery<AddressFromToFilter>).bind(null, AddressFromToFilterValues);

const NO_TYPES: Array<TokenType> = [];

const getFilters = (queryFilters: PaginationFilters<'core:address_token_transfers'>, chain: ClusterChainConfig | undefined): Filters => ({
  filter: getAddressFilterValue(queryFilters.filter),
  type: getFilterValuesFromQuery(
    Object.keys(getTokenTypes('all', chain?.app_config)),
    queryFilters.type,
  ) || NO_TYPES,
});

interface Props {
  currentAddress: string;
  enabled?: boolean;
  chain?: ClusterChainConfig;
}

export default function useAddressTokenTransfersQuery({ currentAddress, enabled, chain }: Props) {
  const query = useApiPaginatedQuery({
    resourceName: 'core:address_token_transfers',
    pathParams: { hash: currentAddress },
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

  const filters = React.useMemo(() => getFilters(query.filters, chain), [ query.filters, chain ]);

  const { onFilterChange } = query;
  const onTypeFilterChange = React.useCallback((nextValue: Array<TokenType>) => {
    onFilterChange({ ...filters, type: nextValue });
  }, [ filters, onFilterChange ]);

  const onAddressFilterChange = React.useCallback((nextValue: string) => {
    onFilterChange({ ...filters, filter: getAddressFilterValue(nextValue) });
  }, [ filters, onFilterChange ]);

  return React.useMemo(() => ({
    query,
    filters,
    onTypeFilterChange,
    onAddressFilterChange,
  }), [ query, filters, onTypeFilterChange, onAddressFilterChange ]);
}
