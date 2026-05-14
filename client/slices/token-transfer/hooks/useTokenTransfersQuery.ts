// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import type { TokenType } from 'client/slices/token/types/api';

import { getTokenTransfersStub } from 'client/slices/token-transfer/stubs';
import { getTokenFilterValue } from 'client/slices/token/utils/list-utils';

import getQueryParamString from 'client/shared/router/get-query-param-string';

import multichainConfig from 'configs/multichain';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

const getFilters = (query: Record<string, string | Array<string> | undefined>) => {
  const chainIdParam = getQueryParamString(query.chain_id);
  const typeParam = getQueryParamString(query.type);
  const config = multichainConfig();

  const chainConfig = chainIdParam ? config?.chains.find(chain => chain.id === chainIdParam) : config?.chains[0];
  return getTokenFilterValue(typeParam, chainConfig?.app_config) || [];
};

interface Props {
  isMultichain?: boolean;
  enabled?: boolean;
}

export default function useTokenTransfersQuery({ isMultichain, enabled }: Props) {
  const router = useRouter();
  const [ typeFilter, setTypeFilter ] = React.useState<Array<TokenType>>(getFilters(router.query));

  React.useEffect(() => {
    if (enabled) {
      setTypeFilter(getFilters(router.query));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ enabled ]);

  const query = useQueryWithPages({
    resourceName: 'general:token_transfers_all',
    filters: { type: typeFilter },
    options: {
      placeholderData: getTokenTransfersStub(),
      enabled,
    },
    isMultichain,
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
