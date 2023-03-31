import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useEffect, useState } from 'react';

import type { AppItemOverview, MarketplaceCategoriesIds } from 'types/client/apps';

import appConfig from 'configs/app/config';
import type { ResourceError } from 'lib/api/resources';
import useDebounce from 'lib/hooks/useDebounce';
import useApiFetch from 'lib/hooks/useFetch';

const favoriteAppsLocalStorageKey = 'favoriteApps';

function getFavoriteApps() {
  try {
    return JSON.parse(localStorage.getItem(favoriteAppsLocalStorageKey) || '[]') as Array<string>;
  } catch (e) {
    return [];
  }
}

function isAppNameMatches(q: string, app: AppItemOverview) {
  return app.title.toLowerCase().includes(q.toLowerCase());
}

function isAppCategoryMatches(category: MarketplaceCategoriesIds, app: AppItemOverview, favoriteApps: Array<string>) {
  return category === 'all' ||
      (category === 'favorites' && favoriteApps.includes(app.id)) ||
      app.categories.includes(category);
}

export default function useMarketplaceApps() {
  const [ selectedAppId, setSelectedAppId ] = useState<string | null>(null);
  const [ selectedCategoryId, setSelectedCategoryId ] = useState<MarketplaceCategoriesIds>('all');
  const [ filterQuery, setFilterQuery ] = useState('');
  const [ favoriteApps, setFavoriteApps ] = useState<Array<string>>([]);

  const apiFetch = useApiFetch();
  const { isLoading, isError, error, data } = useQuery<unknown, ResourceError<unknown>, Array<AppItemOverview>>(
    [ 'marketplace-apps' ],
    async() => apiFetch(appConfig.marketplaceConfigUrl || ''),
    {
      select: (data) => (data as Array<AppItemOverview>).sort((a, b) => a.title.localeCompare(b.title)),
    });

  const handleFavoriteClick = useCallback((id: string, isFavorite: boolean) => {
    const favoriteApps = getFavoriteApps();

    if (isFavorite) {
      const result = favoriteApps.filter((appId: string) => appId !== id);
      setFavoriteApps(result);
      localStorage.setItem(favoriteAppsLocalStorageKey, JSON.stringify(result));
    } else {
      favoriteApps.push(id);
      localStorage.setItem(favoriteAppsLocalStorageKey, JSON.stringify(favoriteApps));
      setFavoriteApps(favoriteApps);
    }
  }, [ ]);

  const showAppInfo = useCallback((id: string) => {
    setSelectedAppId(id);
  }, []);

  const debouncedFilterQuery = useDebounce(filterQuery, 500);
  const clearSelectedAppId = useCallback(() => setSelectedAppId(null), []);

  const handleCategoryChange = useCallback((newCategory: MarketplaceCategoriesIds) => {
    setSelectedCategoryId(newCategory);
  }, []);

  const displayedApps = React.useMemo(() => {
    return data?.filter(app => isAppNameMatches(debouncedFilterQuery, app) && isAppCategoryMatches(selectedCategoryId, app, favoriteApps)) || [];
  }, [ selectedCategoryId, data, debouncedFilterQuery, favoriteApps ]);

  const categories = React.useMemo(() => {
    return data?.map(app => app.categories).flat() || [];
  }, [ data ]);

  useEffect(() => {
    setFavoriteApps(getFavoriteApps());
  }, [ ]);

  return React.useMemo(() => ({
    selectedCategoryId,
    onCategoryChange: handleCategoryChange,
    onSearchInputChange: setFilterQuery,
    isLoading,
    isError,
    error,
    categories,
    displayedApps,
    showAppInfo,
    selectedAppId,
    clearSelectedAppId,
    favoriteApps,
    onFavoriteClick: handleFavoriteClick,
  }), [
    selectedCategoryId,
    categories,
    clearSelectedAppId,
    selectedAppId,
    displayedApps,
    error,
    favoriteApps,
    handleCategoryChange,
    handleFavoriteClick,
    isError,
    isLoading,
    showAppInfo,
  ]);
}
