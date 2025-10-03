import React from 'react';

import type { FormattedData } from 'ui/address/tokenSelect/types';

import useApiQuery from 'lib/api/useApiQuery';
import { calculateUsdValue } from 'ui/address/utils/tokenUtils';

interface Props {
  hash?: string;
  enabled?: boolean;
}

export interface ReturnType {
  isPending: boolean;
  isError: boolean;
  data: FormattedData;
}

export default function useFetchTokens({ hash, enabled }: Props): ReturnType {
  const erc20Query = useApiQuery('multichainAggregator:address_tokens', {
    pathParams: { hash },
    queryParams: { type: 'ERC-20' },
    queryOptions: {
      enabled: Boolean(hash) && enabled,
      refetchOnMount: false,
    },
  });

  const erc721Query = useApiQuery('multichainAggregator:address_tokens', {
    pathParams: { hash },
    queryParams: { type: 'ERC-721' },
    queryOptions: {
      enabled: Boolean(hash) && enabled,
      refetchOnMount: false,
    },
  });

  const erc1155Query = useApiQuery('multichainAggregator:address_tokens', {
    pathParams: { hash },
    queryParams: { type: 'ERC-1155' },
    queryOptions: {
      enabled: Boolean(hash) && enabled,
      refetchOnMount: false,
    },
  });

  const erc404Query = useApiQuery('multichainAggregator:address_tokens', {
    pathParams: { hash },
    queryParams: { type: 'ERC-404' },
    queryOptions: {
      enabled: Boolean(hash) && enabled,
      refetchOnMount: false,
    },
  });

  const isPending = erc20Query.isPending || erc721Query.isPending || erc1155Query.isPending || erc404Query.isPending;
  const isError = erc20Query.isError || erc721Query.isError || erc1155Query.isError || erc404Query.isError;

  const data = React.useMemo(() => {
    return {
      'ERC-20': {
        items: erc20Query.data?.items.map(calculateUsdValue) || [],
        isOverflow: Boolean(erc20Query.data?.next_page_params),
      },
      'ERC-721': {
        items: erc721Query.data?.items.map(calculateUsdValue) || [],
        isOverflow: Boolean(erc721Query.data?.next_page_params),
      },
      'ERC-1155': {
        items: erc1155Query.data?.items.map(calculateUsdValue) || [],
        isOverflow: Boolean(erc1155Query.data?.next_page_params),
      },
      'ERC-404': {
        items: erc404Query.data?.items.map(calculateUsdValue) || [],
        isOverflow: Boolean(erc404Query.data?.next_page_params),
      },
    };
  }, [ erc20Query.data, erc721Query.data, erc1155Query.data, erc404Query.data ]);

  return {
    isPending,
    isError,
    data,
  };
}
