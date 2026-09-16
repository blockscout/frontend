// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { CrossChainBridgedTokensSorting, CrossChainBridgedTokensSortingField, CrossChainBridgedTokensSortingValue } from '../types/api';

import { INTERCHAIN_BRIDGED_TOKEN_ITEM } from 'src/features/cross-chain-txs/stubs/messages';

import config from 'src/config';
import useApiPaginatedQuery from 'src/shared/pagination/useApiPaginatedQuery';
import { useDebouncedFilterChange } from 'src/shared/pagination/useDebouncedFilterChange';
import { generateListStub } from 'src/shared/pagination/utils';
import getQueryParamString from 'src/shared/router/get-query-param-string';
import getSortParamsFromValue from 'src/shared/sort/get-sort-params-from-value';
import getSortValueFromQuery from 'src/shared/sort/get-sort-value-from-query';

import type { OnValueChangeHandler } from 'src/toolkit/chakra/select';

import { BRIDGED_TOKENS_SORT_OPTIONS } from '../utils/bridged-tokens-sort';

interface Props {
  enabled?: boolean;
}

export default function useBridgedTokensQuery({ enabled }: Props) {
  const query = useApiPaginatedQuery({
    resourceName: 'interchainIndexer:bridged_tokens',
    pathParams: {
      chainId: config.chain.id,
    },
    options: {
      enabled,
      placeholderData: generateListStub<'interchainIndexer:bridged_tokens'>(INTERCHAIN_BRIDGED_TOKEN_ITEM, 10, { next_page_params: { page_token: 'token' } }),
    },
  });

  const searchTerm = getQueryParamString(query.filters.q);
  const sort = getSortValueFromQuery<CrossChainBridgedTokensSortingValue>({ ...query.sorting }, BRIDGED_TOKENS_SORT_OPTIONS) ?? 'default';

  const { onFilterChange, onSortingChange } = query;

  const onSearchTermChange = useDebouncedFilterChange((value) => onFilterChange({ q: value }));

  const onSortChange: OnValueChangeHandler = React.useCallback(({ value }) => {
    onSortingChange(
      getSortParamsFromValue<CrossChainBridgedTokensSortingValue, CrossChainBridgedTokensSortingField, CrossChainBridgedTokensSorting['order']>(
        value[0] as CrossChainBridgedTokensSortingValue,
      ),
    );
  }, [ onSortingChange ]);

  return React.useMemo(() => ({
    query,
    sort,
    searchTerm,
    onSearchTermChange,
    onSortChange,
  }), [ query, sort, searchTerm, onSearchTermChange, onSortChange ]);
}
