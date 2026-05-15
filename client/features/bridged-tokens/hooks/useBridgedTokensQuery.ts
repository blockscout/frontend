// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import type { TokensSortingValue, TokensSortingField, TokensSorting } from 'client/slices/token/types/api';

import { TOKEN_INFO_ERC_20 } from 'client/slices/token/stubs';
import { SORT_OPTIONS } from 'client/slices/token/utils/list-utils';

import { getBridgedChainsFilterValue } from 'client/features/bridged-tokens/utils/bridged-chains-filter';

import useDebounce from 'client/shared/hooks/useDebounce';
import getQueryParamString from 'client/shared/router/get-query-param-string';

import { generateListStub } from 'stubs/utils';
import type { OnValueChangeHandler } from 'toolkit/chakra/select';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import getSortParamsFromValue from 'ui/shared/sort/getSortParamsFromValue';
import getSortValueFromQuery from 'ui/shared/sort/getSortValueFromQuery';

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
