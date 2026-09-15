// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TokensSortingValue, TokensSortingField, TokensSorting } from 'src/slices/token/types/api';

import { TOKEN_INFO_ERC_20 } from 'src/slices/token/stubs';
import { SORT_OPTIONS } from 'src/slices/token/utils/list-utils';

import { getBridgedChainsFilterValue } from 'src/features/bridged-tokens/utils/bridged-chains-filter';

import useApiPaginatedQuery from 'src/shared/pagination/useApiPaginatedQuery';
import { useDebouncedFilterChange } from 'src/shared/pagination/useDebouncedFilterChange';
import { generateListStub } from 'src/shared/pagination/utils';
import getQueryParamString from 'src/shared/router/get-query-param-string';
import getSortParamsFromValue from 'src/shared/sort/get-sort-params-from-value';
import getSortValueFromQuery from 'src/shared/sort/get-sort-value-from-query';

import type { OnValueChangeHandler } from 'src/toolkit/chakra/select';

interface Props {
  enabled?: boolean;
}

export default function useBridgedTokensQuery({ enabled }: Props) {
  const query = useApiPaginatedQuery({
    resourceName: 'core:tokens_bridged',
    options: {
      enabled,
      placeholderData: generateListStub<'core:tokens_bridged'>(
        TOKEN_INFO_ERC_20,
        50,
        { next_page_params: { holders_count: 81528, items_count: 50, name: '', market_cap: null },
        }),
    },
  });

  const searchTerm = getQueryParamString(query.filters.q);
  const chainIdsParam = query.filters.chain_ids;
  const bridgeChains = React.useMemo(() => getBridgedChainsFilterValue(chainIdsParam), [ chainIdsParam ]);
  const sort = getSortValueFromQuery<TokensSortingValue>({ ...query.sorting }, SORT_OPTIONS) ?? 'default';

  const { onFilterChange, onSortingChange } = query;

  const onSearchTermChange = useDebouncedFilterChange((value) => onFilterChange({ q: value, chain_ids: bridgeChains }));

  const onBridgeChainsChange = React.useCallback((value: Array<string>) => {
    onFilterChange({ q: searchTerm, chain_ids: value });
  }, [ searchTerm, onFilterChange ]);

  const onSortChange: OnValueChangeHandler = React.useCallback(({ value }) => {
    onSortingChange(getSortParamsFromValue<TokensSortingValue, TokensSortingField, TokensSorting['order']>(value[0] as TokensSortingValue));
  }, [ onSortingChange ]);

  return React.useMemo(() => ({
    query,
    searchTerm,
    bridgeChains,
    sort,
    onSearchTermChange,
    onBridgeChainsChange,
    onSortChange,
  }), [ query, searchTerm, bridgeChains, sort, onSearchTermChange, onBridgeChainsChange, onSortChange ]);
}
