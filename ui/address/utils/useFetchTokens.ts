import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';

import { calculateUsdValue } from './tokenUtils';

interface Props {
  hash?: string;
}

export default function useFetchTokens({ hash }: Props) {
  const erc20query = useApiQuery('address_tokens', {
    pathParams: { hash },
    queryParams: { type: 'ERC-20' },
    queryOptions: { enabled: Boolean(hash), refetchOnMount: false },
  });
  const erc721query = useApiQuery('address_tokens', {
    pathParams: { hash },
    queryParams: { type: 'ERC-721' },
    queryOptions: { enabled: Boolean(hash), refetchOnMount: false },
  });
  const erc1155query = useApiQuery('address_tokens', {
    pathParams: { hash },
    queryParams: { type: 'ERC-1155' },
    queryOptions: { enabled: Boolean(hash), refetchOnMount: false },
  });

  const refetch = React.useCallback(() => {
    erc20query.refetch();
    erc721query.refetch();
    erc1155query.refetch();
  }, [ erc1155query, erc20query, erc721query ]);

  const data = React.useMemo(() => {
    return {
      'ERC-20': {
        items: erc20query.data?.items.map(calculateUsdValue) || [],
        isOverflow: Boolean(erc20query.data?.next_page_params),
      },
      'ERC-721': {
        items: erc721query.data?.items.map(calculateUsdValue) || [],
        isOverflow: Boolean(erc721query.data?.next_page_params),
      },
      'ERC-1155': {
        items: erc1155query.data?.items.map(calculateUsdValue) || [],
        isOverflow: Boolean(erc1155query.data?.next_page_params),
      },
    };
  }, [ erc1155query.data, erc20query.data, erc721query.data ]);

  return {
    isLoading: erc20query.isLoading || erc721query.isLoading || erc1155query.isLoading,
    isError: erc20query.isError || erc721query.isError || erc1155query.isError,
    data,
    refetch,
  };
}
