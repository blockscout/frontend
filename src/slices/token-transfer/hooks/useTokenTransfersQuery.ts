// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import type { ClusterChainConfig } from 'src/features/multichain/types/client';
import type { TokenType } from 'src/slices/token/types/api';

import { getTokenTransfersStub } from 'src/slices/token-transfer/stubs';
import { getTokenFilterValue } from 'src/slices/token/utils/list-utils';

import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import getQueryParamString from 'src/shared/router/get-query-param-string';

const getFilters = (query: Record<string, string | Array<string> | undefined>, chain: ClusterChainConfig | undefined) => {
  const typeParam = getQueryParamString(query.type);
  return getTokenFilterValue(typeParam, chain?.app_config) || [];
};

interface Props {
  chain?: ClusterChainConfig;
  enabled?: boolean;
}

export default function useTokenTransfersQuery({ chain, enabled }: Props) {
  const router = useRouter();
  const [ typeFilter, setTypeFilter ] = React.useState<Array<TokenType>>(getFilters(router.query, chain));

  React.useEffect(() => {
    if (enabled) {
      setTypeFilter(getFilters(router.query, chain));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ enabled ]);

  const query = useQueryWithPages({
    resourceName: 'core:token_transfers_all',
    filters: { type: typeFilter },
    options: {
      placeholderData: getTokenTransfersStub(),
      enabled,
    },
    chain,
  });

  const onTokenTypesChange = React.useCallback((value: Array<TokenType>) => {
    query.onFilterChange({ type: value });
    setTypeFilter(value);
  }, [ query ]);

  return React.useMemo(() => ({
    query,
    typeFilter,
    onTokenTypesChange,
  }), [ query, typeFilter, onTokenTypesChange ]);
}
