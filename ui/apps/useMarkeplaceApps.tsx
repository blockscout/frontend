import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useState } from 'react';

import type { AppItemOverview, MarketplaceCategoriesIds } from 'types/client/apps';

import appConfig from 'configs/app/config';
import marketplaceApps from 'data/marketplaceApps.json';

const favoriteAppsLocalStorageKey = 'favoriteApps';

function getFavoriteApps() {
  try {
    return JSON.parse(localStorage.getItem(favoriteAppsLocalStorageKey) || '[]');
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
  const [ isLoading, setIsLoading ] = useState(true);
  const [ defaultAppList, setDefaultAppList ] = useState<Array<AppItemOverview>>();
  const [ displayedApps, setDisplayedApps ] = useState<Array<AppItemOverview>>([]);
  const [ displayedAppId, setDisplayedAppId ] = useState<string | null>(null);
  const [ category, setCategory ] = useState<MarketplaceCategoriesIds>('all');
  const [ filterQuery, setFilterQuery ] = useState('');
  const [ favoriteApps, setFavoriteApps ] = useState<Array<string>>([]);

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
    setDisplayedAppId(id);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFilterApps = useCallback(debounce(q => setFilterQuery(q), 500), []);
  const clearDisplayedAppId = useCallback(() => setDisplayedAppId(null), []);

  const filterApps = useCallback((q: string, category: MarketplaceCategoriesIds) => {
    const apps = defaultAppList
      ?.filter(app => {
        return isAppNameMatches(q, app) && isAppCategoryMatches(category, app, favoriteApps);
      });

    setDisplayedApps(apps || []);
  }, [ defaultAppList, favoriteApps ]);

  const handleCategoryChange = useCallback((newCategory: MarketplaceCategoriesIds) => {
    setCategory(newCategory);
  }, []);

  useEffect(() => {
    setFavoriteApps(getFavoriteApps());
  }, [ ]);

  useEffect(() => {
    filterApps(filterQuery, category);
  }, [ filterQuery, category, filterApps ]);

  useEffect(() => {
    const defaultDisplayedApps = [ ...marketplaceApps ]
      .filter(item => item.chainIds.includes(appConfig.network.id))
      .sort((a, b) => a.title.localeCompare(b.title));

    setDefaultAppList(defaultDisplayedApps);
    setDisplayedApps(defaultDisplayedApps);
    setIsLoading(false);
  }, [ ]);

  return React.useMemo(() => ({
    category,
    handleCategoryChange,
    debounceFilterApps,
    isLoading,
    displayedApps,
    showAppInfo,
    displayedAppId,
    clearDisplayedAppId,
    favoriteApps,
    handleFavoriteClick,
  }), [ category,
    clearDisplayedAppId,
    debounceFilterApps,
    displayedAppId, displayedApps,
    favoriteApps,
    handleCategoryChange,
    handleFavoriteClick,
    isLoading,
    showAppInfo,
  ]);
}
