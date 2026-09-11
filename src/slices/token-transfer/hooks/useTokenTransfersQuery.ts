// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ClusterChainConfig } from 'src/features/multichain/types/client';
import type { TokenType } from 'src/slices/token/types/api';

import { getTokenTransfersStub } from 'src/slices/token-transfer/stubs';
import { getTokenFilterValue } from 'src/slices/token/utils/list-utils';

import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';

const NO_TYPES: Array<TokenType> = [];

interface Props {
  chain?: ClusterChainConfig;
  enabled?: boolean;
}

export default function useTokenTransfersQuery({ chain, enabled }: Props) {
  const query = useQueryWithPages({
    resourceName: 'core:token_transfers_all',
    options: {
      placeholderData: getTokenTransfersStub(),
      enabled,
    },
    chain,
  });

  const typeParam = query.filters.type;
  const typeFilter = React.useMemo(
    () => getTokenFilterValue(typeParam, chain?.app_config) || NO_TYPES,
    [ typeParam, chain?.app_config ],
  );

  const { onFilterChange } = query;
  const onTokenTypesChange = React.useCallback((value: Array<TokenType>) => {
    onFilterChange({ type: value });
  }, [ onFilterChange ]);

  return React.useMemo(() => ({
    query,
    typeFilter,
    onTokenTypesChange,
  }), [ query, typeFilter, onTokenTypesChange ]);
}
