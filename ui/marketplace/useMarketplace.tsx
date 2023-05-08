import { useQuery } from '@tanstack/react-query';
import _unique from 'lodash/uniq';
import React, { useCallback, useEffect, useState } from 'react';

import type { MarketplaceAppOverview } from 'types/client/marketplace';
import { MarketplaceCategory } from 'types/client/marketplace';

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

function isAppNameMatches(q: string, app: MarketplaceAppOverview) {
  return app.title.toLowerCase().includes(q.toLowerCase());
}

function isAppCategoryMatches(category: string, app: MarketplaceAppOverview, favoriteApps: Array<string>) {
  return category === MarketplaceCategory.ALL ||
      (category === MarketplaceCategory.FAVORITES && favoriteApps.includes(app.id)) ||
      app.categories.includes(category);
}

export default function useMarketplace() {
  const [ selectedAppId, setSelectedAppId ] = useState<string | null>(null);
  const [ selectedCategoryId, setSelectedCategoryId ] = useState<string>(MarketplaceCategory.ALL);
  const [ filterQuery, setFilterQuery ] = useState('');
  const [ favoriteApps, setFavoriteApps ] = useState<Array<string>>([]);

  const apiFetch = useApiFetch();
  const { isLoading, isError, error, data } = useQuery<unknown, ResourceError<unknown>, Array<MarketplaceAppOverview>>(
    [ 'marketplace-apps' ],
    async() => apiFetch(appConfig.marketplaceConfigUrl || ''),
    {
      select: (data) => (data as Array<MarketplaceAppOverview>).sort((a, b) => a.title.localeCompare(b.title)),
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

  const handleCategoryChange = useCallback((newCategory: string) => {
    setSelectedCategoryId(newCategory);
  }, []);

  const displayedApps = React.useMemo(() => {
    return data?.filter(app => isAppNameMatches(debouncedFilterQuery, app) && isAppCategoryMatches(selectedCategoryId, app, favoriteApps)) || [];
  }, [ selectedCategoryId, data, debouncedFilterQuery, favoriteApps ]);

  const categories = React.useMemo(() => {
    return _unique(data?.map(app => app.categories).flat()) || [];
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
