import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { MarketplaceAppWithSecurityReport, AppRating } from 'types/client/marketplace';
import { MarketplaceCategory } from 'types/client/marketplace';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';
import useFetch from 'lib/hooks/useFetch';
import { MARKETPLACE_APP } from 'stubs/marketplace';

import useSecurityReports from './useSecurityReports';
import type { SortValue } from './utils';

const feature = config.features.marketplace;

function isAppNameMatches(q: string, app: MarketplaceAppWithSecurityReport) {
  return app.title.toLowerCase().includes(q.toLowerCase());
}

function isAppCategoryMatches(category: string, app: MarketplaceAppWithSecurityReport, favoriteApps: Array<string> = []) {
  return category === MarketplaceCategory.ALL ||
      (category === MarketplaceCategory.FAVORITES && favoriteApps.includes(app.id)) ||
      app.categories.includes(category);
}

function sortApps(apps: Array<MarketplaceAppWithSecurityReport>, favoriteApps: Array<string> = []) {
  return apps.sort((a, b) => {
    const priorityA = a.priority || 0;
    const priorityB = b.priority || 0;
    // First, sort by favorite apps
    if (favoriteApps.includes(a.id) !== favoriteApps.includes(b.id)) {
      return favoriteApps.includes(a.id) ? -1 : 1;
    }
    // Then sort by priority (descending)
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

export default function useMarketplaceApps(
  filter: string,
  selectedCategoryId: string = MarketplaceCategory.ALL,
  favoriteApps: Array<string> | undefined = undefined,
  isFavoriteAppsLoaded: boolean = false,
  ratings: Record<string, AppRating> | undefined = undefined,
) {
  const fetch = useFetch();
  const apiFetch = useApiFetch();

  const { data: securityReports, isPlaceholderData: isSecurityReportsPlaceholderData } = useSecurityReports();

  const [ sorting, setSorting ] = React.useState<SortValue>();
  // Set the value only 1 time to avoid unnecessary useQuery calls and re-rendering of all applications
  const [ snapshotFavoriteApps, setSnapshotFavoriteApps ] = React.useState<Array<string> | undefined>();
  const isInitialSetup = React.useRef(true);

  React.useEffect(() => {
    if (isInitialSetup.current && (isFavoriteAppsLoaded || favoriteApps === undefined)) {
      setSnapshotFavoriteApps(favoriteApps || []);
      isInitialSetup.current = false;
    }
  }, [ isFavoriteAppsLoaded, favoriteApps ]);

  const {
    isPlaceholderData: isAppsPlaceholderData, isError, error, data,
  } = useQuery<unknown, ResourceError<unknown>, Array<MarketplaceAppWithSecurityReport>>({
    queryKey: [ 'marketplace-dapps', snapshotFavoriteApps ],
    queryFn: async() => {
      if (!feature.isEnabled) {
        return [];
      } else if ('configUrl' in feature) {
        return fetch<Array<MarketplaceAppWithSecurityReport>, unknown>(feature.configUrl, undefined, { resource: 'marketplace-dapps' });
      } else {
        return apiFetch('admin:marketplace_dapps', { pathParams: { chainId: config.chain.id } });
      }
    },
    select: (data) => sortApps(data as Array<MarketplaceAppWithSecurityReport>, snapshotFavoriteApps),
    placeholderData: feature.isEnabled ? Array(9).fill(MARKETPLACE_APP) : undefined,
    staleTime: Infinity,
    enabled: feature.isEnabled && Boolean(snapshotFavoriteApps),
  });

  const isPlaceholderData = isAppsPlaceholderData || isSecurityReportsPlaceholderData;

  const appsWithSecurityReportsAndRating = React.useMemo(() =>
    data?.map((app) => ({
      ...app,
      securityReport: securityReports?.[app.id],
      rating: ratings?.[app.id],
    })),
  [ data, securityReports, ratings ]);

  const displayedApps = React.useMemo(() => {
    if (isPlaceholderData) {
      return appsWithSecurityReportsAndRating || [];
    }

    return appsWithSecurityReportsAndRating
      ?.filter(app => isAppNameMatches(filter, app) && isAppCategoryMatches(selectedCategoryId, app, favoriteApps))
      .sort((a, b) => {
        if (sorting === 'security_score') {
          return (b.securityReport?.overallInfo.securityScore || 0) - (a.securityReport?.overallInfo.securityScore || 0);
        }
        if (sorting === 'rating_score') {
          return (b.rating?.value || 0) - (a.rating?.value || 0);
        }
        if (sorting === 'rating_count') {
          return (b.rating?.count || 0) - (a.rating?.count || 0);
        }
        return 0;
      }) || [];
  }, [ selectedCategoryId, appsWithSecurityReportsAndRating, filter, favoriteApps, sorting, isPlaceholderData ]);

  return React.useMemo(() => ({
    data,
    displayedApps,
    error,
    isError,
    isPlaceholderData,
    setSorting,
  }), [
    data,
    displayedApps,
    error,
    isError,
    isPlaceholderData,
    setSorting,
  ]);
}
