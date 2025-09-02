import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { CrossChainInfo } from 'types/client/crossChainInfo';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useFetch from 'lib/hooks/useFetch';

const zetachainFeature = config.features.zetachain;

export default function useZetaChainConfig() {

  const fetch = useFetch();
  const { isPending, data } = useQuery<unknown, ResourceError<unknown>, Array<CrossChainInfo>>({
    queryKey: [ 'zetachain-config' ],
    queryFn: async() => fetch(zetachainFeature.isEnabled ? zetachainFeature.chainsConfigUrl : '', undefined, { resource: 'zetachain-config' }),
    enabled: Boolean(zetachainFeature.isEnabled),
    staleTime: Infinity,
  });

  return React.useMemo(() => ({
    isPending,
    data,
  }), [ data, isPending ]);
}
