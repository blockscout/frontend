// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import { MarketplaceCategory } from 'src/features/marketplace/types/client';

import * as mixpanel from 'src/services/mixpanel';
import useDebounce from 'src/shared/hooks/useDebounce';
import getQueryParamString from 'src/shared/router/get-query-param-string';

import useFavoriteApps from './useFavoriteApps';
import useMarketplaceApps from './useMarketplaceApps';
import useMarketplaceCategories from './useMarketplaceCategories';

export default function useMarketplace() {
  const router = useRouter();
  const defaultCategoryId = getQueryParamString(router.query.category);
  const defaultFilterQuery = getQueryParamString(router.query.filter);

  const [ selectedAppId, setSelectedAppId ] = React.useState<string | null>(null);
  const [ selectedCategoryId, setSelectedCategoryId ] = React.useState<string>(MarketplaceCategory.ALL);
  const [ filterQuery, setFilterQuery ] = React.useState(defaultFilterQuery);
  const [ isDisclaimerModalOpen, setIsDisclaimerModalOpen ] = React.useState<boolean>(false);

  const { favoriteApps, onFavoriteClick } = useFavoriteApps();

  const showDisclaimer = React.useCallback((id: string) => {
    setSelectedAppId(id);
    setIsDisclaimerModalOpen(true);
  }, []);

  const debouncedFilterQuery = useDebounce(filterQuery, 500);
  const clearSelectedAppId = React.useCallback(() => {
    setSelectedAppId(null);
    setIsDisclaimerModalOpen(false);
  }, []);

  const handleCategoryChange = React.useCallback((newCategory: string) => {
    mixpanel.logEvent(mixpanel.EventTypes.FILTERS, { Source: 'Marketplace', 'Filter name': newCategory });
    setSelectedCategoryId(newCategory);
  }, []);

  const {
    isPlaceholderData, isError, error, data, displayedApps, setSorting, refetch,
  } = useMarketplaceApps(debouncedFilterQuery, selectedCategoryId, favoriteApps);
  const {
    isPlaceholderData: isCategoriesPlaceholderData, data: categories,
  } = useMarketplaceCategories(data, isPlaceholderData);

  React.useEffect(() => {
    if (!isPlaceholderData && !isError) {
      const isValidDefaultCategory = categories.map(c => c.name).includes(defaultCategoryId);
      isValidDefaultCategory && setSelectedCategoryId(defaultCategoryId);
    }
    // run only when data is loaded
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ isPlaceholderData ]);

  React.useEffect(() => {
    const appId = getQueryParamString(router.query.selectedAppId);
    if (appId) {
      router.replace({ pathname: '/apps/[id]/info', query: { id: appId } });
    }
  }, [ router.query.selectedAppId, router ]);

  React.useEffect(() => {
    if (isPlaceholderData) {
      return;
    }

    const { query } = router;
    const newQuery = { ...query };

    if (selectedCategoryId !== MarketplaceCategory.ALL) {
      newQuery.category = selectedCategoryId;
    } else {
      delete newQuery.category;
    }

    if (debouncedFilterQuery) {
      newQuery.filter = debouncedFilterQuery;
    } else {
      delete newQuery.filter;
    }

    if (debouncedFilterQuery.length > 0) {
      mixpanel.logEvent(mixpanel.EventTypes.LOCAL_SEARCH, { Source: 'Marketplace', 'Search query': debouncedFilterQuery });
    }

    router.replace(
      { pathname: '/apps', query: newQuery },
      undefined,
      { shallow: true },
    );
  // omit router in the deps because router.push() somehow modifies it
  // and we get infinite re-renders then
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ debouncedFilterQuery, selectedCategoryId, isPlaceholderData ]);

  return React.useMemo(() => ({
    selectedCategoryId,
    onCategoryChange: handleCategoryChange,
    filterQuery: debouncedFilterQuery,
    onSearchInputChange: setFilterQuery,
    isPlaceholderData,
    isError,
    error,
    categories,
    apps: data,
    displayedApps,
    selectedAppId,
    clearSelectedAppId,
    favoriteApps,
    onFavoriteClick,
    isDisclaimerModalOpen,
    showDisclaimer,
    appsTotal: data?.length || 0,
    isCategoriesPlaceholderData,
    setSorting,
    refetch,
  }), [
    selectedCategoryId,
    categories,
    clearSelectedAppId,
    selectedAppId,
    data,
    displayedApps,
    error,
    favoriteApps,
    handleCategoryChange,
    onFavoriteClick,
    isError,
    isPlaceholderData,
    debouncedFilterQuery,
    isDisclaimerModalOpen,
    showDisclaimer,
    isCategoriesPlaceholderData,
    setSorting,
    refetch,
  ]);
}
