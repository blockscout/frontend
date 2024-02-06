import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { MarketplaceAppOverview } from 'types/client/marketplace';
import { MarketplaceCategory } from 'types/client/marketplace';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useFeatureValue from 'lib/growthbook/useFeatureValue';
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

function sortApps(apps: Array<MarketplaceAppOverview>, isExperiment: boolean) {
  if (!isExperiment) {
    return apps.sort((a, b) => a.title.localeCompare(b.title));
  }
  return apps.sort((a, b) => {
    const priorityA = a.priority || 0;
    const priorityB = b.priority || 0;
    // First, sort by priority (descending)
    if (priorityB !== priorityA) {
      return priorityB - priorityA;
    }
    // If priority is the same, sort by internalWallet (true first)
    if (a.internalWallet !== b.internalWallet) {
      return a.internalWallet ? -1 : 1;
    }
    // If internalWallet is also the same, sort by external (false first)
    if (a.external !== b.external) {
      return a.external ? 1 : -1;
    }
    // If all criteria are the same, keep original order (stable sort)
    return 0;
  });
}

export default function useMarketplaceApps(filter: string, selectedCategoryId: string = MarketplaceCategory.ALL, favoriteApps: Array<string> = []) {
  const apiFetch = useApiFetch();
  const { value: isExperiment } = useFeatureValue('marketplace_exp', false);

  const { isPlaceholderData, isError, error, data } = useQuery<unknown, ResourceError<unknown>, Array<MarketplaceAppOverview>>({
    queryKey: [ 'marketplace-apps' ],
    queryFn: async() => apiFetch(configUrl, undefined, { resource: 'marketplace-apps' }),
    select: (data) => sortApps(data as Array<MarketplaceAppOverview>, isExperiment),
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
