import { useRouter } from 'next/router';
import React from 'react';

import type { TokenType } from 'types/api/token';

import { getTokenTransfersStub } from 'stubs/token';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import { getTokenFilterValue } from 'ui/tokens/utils';

interface Props {
  isMultichain?: boolean;
  enabled?: boolean;
}

export default function useTokenTransfersQuery({ isMultichain, enabled }: Props) {
  const router = useRouter();
  const [ typeFilter, setTypeFilter ] = React.useState<Array<TokenType>>(getTokenFilterValue(router.query.type) || []);

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
