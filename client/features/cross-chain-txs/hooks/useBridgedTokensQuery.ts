import { useRouter } from 'next/router';
import React from 'react';

import type { CrossChainBridgedTokensSorting, CrossChainBridgedTokensSortingField, CrossChainBridgedTokensSortingValue } from '../types/api';

import config from 'configs/app';
import { INTERCHAIN_BRIDGED_TOKEN_ITEM } from 'stubs/interchainIndexer';
import { generateListStub } from 'stubs/utils';
import type { OnValueChangeHandler } from 'toolkit/chakra/select';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import getSortParamsFromValue from 'ui/shared/sort/getSortParamsFromValue';
import getSortValueFromQuery from 'ui/shared/sort/getSortValueFromQuery';

import { BRIDGED_TOKENS_SORT_OPTIONS } from '../utils/bridged-tokens-sort';

interface Props {
  enabled?: boolean;
}

export default function useBridgedTokensQuery({ enabled }: Props) {
  const router = useRouter();

  const [ sort, setSort ] = React.useState<CrossChainBridgedTokensSortingValue>(
    getSortValueFromQuery<CrossChainBridgedTokensSortingValue>(router.query, BRIDGED_TOKENS_SORT_OPTIONS) ?? 'default',
  );

  const query = useQueryWithPages({
    resourceName: 'interchainIndexer:bridged_tokens',
    pathParams: {
      chainId: config.chain.id,
    },
    sorting: getSortParamsFromValue<CrossChainBridgedTokensSortingValue, CrossChainBridgedTokensSortingField, CrossChainBridgedTokensSorting['order']>(sort),
    options: {
      enabled,
      placeholderData: generateListStub<'interchainIndexer:bridged_tokens'>(INTERCHAIN_BRIDGED_TOKEN_ITEM, 10, { next_page_params: { page_token: 'token' } }),
    },
  });

  const onSortChange: OnValueChangeHandler = React.useCallback(({ value }) => {
    setSort(value[0] as CrossChainBridgedTokensSortingValue);
    query.onSortingChange(value[0] === 'default' ? undefined : getSortParamsFromValue(value[0] as CrossChainBridgedTokensSortingValue));
  }, [ query ]);

  return React.useMemo(() => ({
    query,
    sort,
    onSortChange,
  }), [ query, sort, onSortChange ]);
}
