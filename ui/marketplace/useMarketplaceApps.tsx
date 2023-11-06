import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { MarketplaceAppOverview } from 'types/client/marketplace';
import { MarketplaceCategory } from 'types/client/marketplace';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useApiFetch from 'lib/hooks/useFetch';
import { MARKETPLACE_APP } from 'stubs/marketplace';

const feature = config.features.marketplace;
const configUrl = feature.isEnabled ? feature.configUrl : '';

function isAppNameMatches(q: string, app: MarketplaceAppOverview) {
  return app.title.toLowerCase().includes(q.toLowerCase());
}

function isAppCategoryMatches(category: string, app: MarketplaceAppOverview, favoriteApps: Array<string>) {
  return category === MarketplaceCategory.ALL ||
      (category === MarketplaceCategory.FAVORITES && favoriteApps.includes(app.id)) ||
      app.categories.includes(category);
}

export default function useMarketplaceApps(filter: string, selectedCategoryId: string = MarketplaceCategory.ALL, favoriteApps: Array<string> = []) {
  const apiFetch = useApiFetch();
  const { isPlaceholderData, isError, error, data } = useQuery<unknown, ResourceError<unknown>, Array<MarketplaceAppOverview>>({
    queryKey: [ 'marketplace-apps' ],
    queryFn: async() => apiFetch(configUrl, undefined, { resource: 'marketplace-apps' }),
    select: (data) => (data as Array<MarketplaceAppOverview>).sort((a, b) => a.title.localeCompare(b.title)),
    placeholderData: feature.isEnabled ? Array(9).fill(MARKETPLACE_APP) : undefined,
    staleTime: Infinity,
    enabled: feature.isEnabled,
  });

  const displayedApps = React.useMemo(() => {
    return data?.filter(app => isAppNameMatches(filter, app) && isAppCategoryMatches(selectedCategoryId, app, favoriteApps)) || [];
  }, [ selectedCategoryId, data, filter, favoriteApps ]);

  return React.useMemo(() => ({
    data,
    displayedApps,
    error,
    isError,
    isPlaceholderData,
  }), [
    data,
    displayedApps,
    error,
    isError,
    isPlaceholderData,
  ]);
}
