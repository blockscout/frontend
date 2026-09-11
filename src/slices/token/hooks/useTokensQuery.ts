// SPDX-License-Identifier: LicenseRef-Blockscout

import { debounce } from 'es-toolkit';
import React from 'react';

import type { TokenType, TokensSortingValue, TokensSortingField, TokensSorting } from 'src/slices/token/types/api';

import { TOKEN_INFO_ERC_20 } from 'src/slices/token/stubs';
import { getTokenFilterValue, SORT_OPTIONS } from 'src/slices/token/utils/list-utils';

import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';
import getQueryParamString from 'src/shared/router/get-query-param-string';
import getSortParamsFromValue from 'src/shared/sort/get-sort-params-from-value';
import getSortValueFromQuery from 'src/shared/sort/get-sort-value-from-query';

import type { OnValueChangeHandler } from 'src/toolkit/chakra/select';
import { SECOND } from 'src/toolkit/utils/consts';

const SEARCH_DEBOUNCE = 0.3 * SECOND;

interface Props {
  enabled?: boolean;
}

export default function useTokensQuery({ enabled }: Props) {
  const query = useQueryWithPages({
    resourceName: 'core:tokens',
    options: {
      enabled,
      placeholderData: generateListStub<'core:tokens'>(
        TOKEN_INFO_ERC_20,
        50,
        { next_page_params: { holders_count: 81528, items_count: 50, name: '', market_cap: null } },
      ),
    },
  });

  const searchTerm = getQueryParamString(query.filters.q);
  const typeParam = query.filters.type;
  const tokenTypes = React.useMemo(() => getTokenFilterValue(typeParam), [ typeParam ]);
  const sort = getSortValueFromQuery<TokensSortingValue>({ ...query.sorting }, SORT_OPTIONS) ?? 'default';

  const { onFilterChange, onSortingChange } = query;

  const onSearchTermChange = React.useMemo(
    () => debounce((value: string) => onFilterChange({ q: value, type: tokenTypes }), SEARCH_DEBOUNCE),
    [ onFilterChange, tokenTypes ],
  );
  React.useEffect(() => () => onSearchTermChange.cancel(), [ onSearchTermChange ]);

  const onTokenTypesChange = React.useCallback((value: Array<TokenType>) => {
    onFilterChange({ q: searchTerm, type: value });
  }, [ searchTerm, onFilterChange ]);

  const onSortChange: OnValueChangeHandler = React.useCallback(({ value }) => {
    onSortingChange(getSortParamsFromValue<TokensSortingValue, TokensSortingField, TokensSorting['order']>(value[0] as TokensSortingValue));
  }, [ onSortingChange ]);

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
