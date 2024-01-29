import { useQuery } from '@tanstack/react-query';
import React from 'react';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useApiFetch from 'lib/hooks/useFetch';

const feature = config.features.marketplaceCategories;
const configUrl = feature.isEnabled ? feature.configUrl : '';

export default function useMarketplaceCategories() {
  const apiFetch = useApiFetch();
  return useQuery<unknown, ResourceError<unknown>, Array<string>>({
    queryKey: [ 'marketplace-categories' ],
    queryFn: async() => apiFetch(configUrl, undefined, { resource: 'marketplace-categories' }),
    select: (data) => (data as Array<string>),
    placeholderData: feature.isEnabled ? Array(9).fill('Bridge').map((c, i) => c + i) : undefined,
    staleTime: Infinity,
    enabled: feature.isEnabled,
  });
}
