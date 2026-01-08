import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { ExternalChain } from 'types/externalChains';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useFetch from 'lib/hooks/useFetch';

const feature = config.features.crossChainTxs;

export default function useCrossChainConfig() {
  const fetch = useFetch();

  const { data, isPending } = useQuery<Array<ExternalChain>, ResourceError<unknown>, Array<ExternalChain>>({
    queryKey: [ 'cross-chain-config' ],
    queryFn: () => feature.isEnabled ? fetch(feature.configUrl) as Promise<Array<ExternalChain>> : Promise.resolve([]),
    enabled: feature.isEnabled,
    staleTime: Infinity,
  });

  return React.useMemo(() => ({
    data,
    isPending,
  }), [ data, isPending ]);
}
