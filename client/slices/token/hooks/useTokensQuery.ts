// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import type { TokenType, TokensSortingValue, TokensSortingField, TokensSorting } from 'client/slices/token/types/api';

import { TOKEN_INFO_ERC_20 } from 'client/slices/token/stubs';
import { getTokenFilterValue, SORT_OPTIONS } from 'client/slices/token/utils/list-utils';

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

export default function useTokensQuery({ enabled }: Props) {
  const router = useRouter();

  const q = getQueryParamString(router.query.q);

  const [ searchTerm, setSearchTerm ] = React.useState<string>(q ?? '');
  const [ tokenTypes, setTokenTypes ] = React.useState<Array<TokenType> | undefined>(getTokenFilterValue(router.query.type));
  const [ sort, setSort ] = React.useState<TokensSortingValue>(getSortValueFromQuery<TokensSortingValue>(router.query, SORT_OPTIONS) ?? 'default');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const query = useQueryWithPages({
    resourceName: 'general:tokens',
    filters: { q: debouncedSearchTerm, type: tokenTypes },
    sorting: getSortParamsFromValue<TokensSortingValue, TokensSortingField, TokensSorting['order']>(sort),
    options: {
      enabled,
      placeholderData: generateListStub<'general:tokens'>(
        TOKEN_INFO_ERC_20,
        50,
        { next_page_params: { holders_count: 81528, items_count: 50, name: '', market_cap: null } },
      ),
    },
  });

  const onSearchTermChange = React.useCallback((value: string) => {
    query.onFilterChange({ q: value, type: tokenTypes });
    setSearchTerm(value);
  }, [ tokenTypes, query ]);

  const onTokenTypesChange = React.useCallback((value: Array<TokenType>) => {
    query.onFilterChange({ q: debouncedSearchTerm, type: value });
    setTokenTypes(value);
  }, [ debouncedSearchTerm, query ]);

  const onSortChange: OnValueChangeHandler = React.useCallback(({ value }) => {
    const sortValue = value[0] as TokensSortingValue;
    setSort(sortValue);
    query.onSortingChange(getSortParamsFromValue(sortValue));
  }, [ query ]);

  return React.useMemo(() => ({
    query,
    searchTerm,
    tokenTypes,
    sort,
    onSearchTermChange,
    onTokenTypesChange,
    onSortChange,
  }), [ query, searchTerm, tokenTypes, sort, onSearchTermChange, onTokenTypesChange, onSortChange ]);
}
