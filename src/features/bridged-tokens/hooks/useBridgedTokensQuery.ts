// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import type { TokensSortingValue, TokensSortingField, TokensSorting } from 'src/slices/token/types/api';

import { TOKEN_INFO_ERC_20 } from 'src/slices/token/stubs';
import { SORT_OPTIONS } from 'src/slices/token/utils/list-utils';

import { getBridgedChainsFilterValue } from 'src/features/bridged-tokens/utils/bridged-chains-filter';

import useDebounce from 'src/shared/hooks/useDebounce';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';
import getQueryParamString from 'src/shared/router/get-query-param-string';
import getSortParamsFromValue from 'src/shared/sort/get-sort-params-from-value';
import getSortValueFromQuery from 'src/shared/sort/get-sort-value-from-query';

import type { OnValueChangeHandler } from 'src/toolkit/chakra/select';

interface Props {
  enabled?: boolean;
}

export default function useBridgedTokensQuery({ enabled }: Props) {
  const router = useRouter();

  const q = getQueryParamString(router.query.q);

  const [ searchTerm, setSearchTerm ] = React.useState<string>(q ?? '');
  const [ bridgeChains, setBridgeChains ] = React.useState<Array<string> | undefined>(getBridgedChainsFilterValue(router.query.chain_ids));
  const [ sort, setSort ] = React.useState<TokensSortingValue>(getSortValueFromQuery<TokensSortingValue>(router.query, SORT_OPTIONS) ?? 'default');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const query = useQueryWithPages({
    resourceName: 'general:tokens_bridged',
    filters: { q: debouncedSearchTerm, chain_ids: bridgeChains },
    sorting: getSortParamsFromValue<TokensSortingValue, TokensSortingField, TokensSorting['order']>(sort),
    options: {
      enabled,
      placeholderData: generateListStub<'general:tokens_bridged'>(
        TOKEN_INFO_ERC_20,
        50,
        { next_page_params: { holders_count: 81528, items_count: 50, name: '', market_cap: null },
        }),
    },
  });

  const onSearchTermChange = React.useCallback((value: string) => {
    query.onFilterChange({ q: value, chain_ids: bridgeChains });
    setSearchTerm(value);
  }, [ bridgeChains, query ]);

  const onBridgeChainsChange = React.useCallback((value: Array<string>) => {
    query.onFilterChange({ q: debouncedSearchTerm, chain_ids: value });
    setBridgeChains(value);
  }, [ debouncedSearchTerm, query ]);

  const onSortChange: OnValueChangeHandler = React.useCallback(({ value }) => {
    const sortValue = value[0] as TokensSortingValue;
    setSort(sortValue);
    query.onSortingChange(getSortParamsFromValue(sortValue));
  }, [ query ]);

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
