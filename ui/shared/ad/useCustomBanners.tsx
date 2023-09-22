import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { AdCustomConfig } from 'types/client/ad';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useApiFetch from 'lib/hooks/useFetch';

const feature = config.features.adsBanner;
const configUrl = (feature.isEnabled && feature.provider === 'custom') ? feature.configUrl : '';
export default function useCustomBanners() {
  const apiFetch = useApiFetch();
  const { isLoading, data } = useQuery<unknown, ResourceError<unknown>, Array<AdCustomConfig>>(
    [ 'custom-configs' ],
    async() => apiFetch(configUrl),
    {
      enabled: feature.isEnabled && feature.provider === 'custom',
      staleTime: Infinity,
    });

  return React.useMemo(() => ({
    data,
    isLoading,
  }), [ data, isLoading ]);
}
