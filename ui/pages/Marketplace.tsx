import { Box } from '@chakra-ui/react';
import React from 'react';

import { MarketplaceCategory } from 'types/client/marketplace';
import type { TabItem } from 'ui/shared/Tabs/types';

import config from 'configs/app';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import useFeatureValue from 'lib/growthbook/useFeatureValue';
import MarketplaceAppModal from 'ui/marketplace/MarketplaceAppModal';
import MarketplaceCategoriesMenu from 'ui/marketplace/MarketplaceCategoriesMenu';
import MarketplaceDisclaimerModal from 'ui/marketplace/MarketplaceDisclaimerModal';
import MarketplaceList from 'ui/marketplace/MarketplaceList';
import FilterInput from 'ui/shared/filters/FilterInput';
import IconSvg from 'ui/shared/IconSvg';
import TabsSkeleton from 'ui/shared/Tabs/TabsSkeleton';
import TabsWithScroll from 'ui/shared/Tabs/TabsWithScroll';

import useMarketplace from '../marketplace/useMarketplace';
const feature = config.features.marketplace;

const Marketplace = () => {
  const {
    isPlaceholderData,
    isError,
    error,
    selectedCategoryId,
    categories,
    onCategoryChange,
    filterQuery,
    onSearchInputChange,
    showAppInfo,
    displayedApps,
    selectedAppId,
    clearSelectedAppId,
    favoriteApps,
    onFavoriteClick,
    isAppInfoModalOpen,
    isDisclaimerModalOpen,
    showDisclaimer,
    appsTotal,
    isCategoriesPlaceholderData,
  } = useMarketplace();

  const { value: isExperiment } = useFeatureValue('marketplace_exp', false);

  const categoryTabs = React.useMemo(() => {
    const tabs: Array<TabItem> = categories.map(category => ({
      id: category.name,
      title: category.name,
      count: category.count,
      component: null,
    }));

    tabs.unshift({
      id: MarketplaceCategory.ALL,
      title: MarketplaceCategory.ALL,
      count: appsTotal,
      component: null,
    });

    tabs.unshift({
      id: MarketplaceCategory.FAVORITES,
      title: () => <IconSvg name="star_outline" w={ 4 } h={ 4 }/>,
      count: null,
      component: null,
    });

    return tabs;
  }, [ categories, appsTotal ]);

  const selectedCategoryIndex = React.useMemo(() => {
    const index = categoryTabs.findIndex(c => c.id === selectedCategoryId);
    return index === -1 ? 0 : index;
  }, [ categoryTabs, selectedCategoryId ]);

  const handleCategoryChange = React.useCallback((index: number) => {
    onCategoryChange(categoryTabs[index].id);
  }, [ categoryTabs, onCategoryChange ]);

  throwOnResourceLoadError(isError && error ? { isError, error } : { isError: false, error: null });

  if (!feature.isEnabled) {
    return null;
  }

  const selectedApp = displayedApps.find(app => app.id === selectedAppId);

  return (
    <>
      { isExperiment && (
        <Box marginTop={{ base: 0, lg: 8 }}>
          { (isCategoriesPlaceholderData) ? (
            <TabsSkeleton tabs={ categoryTabs }/>
          ) : (
            <TabsWithScroll
              tabs={ categoryTabs }
              onTabChange={ handleCategoryChange }
              defaultTabIndex={ selectedCategoryIndex }
              marginBottom={{ base: 0, lg: -2 }}
            />
          ) }
        </Box>
      ) }
      <Box
        display="flex"
        flexDirection={{ base: 'column', sm: 'row' }}
      >
        { !isExperiment && (
          <MarketplaceCategoriesMenu
            categories={ categories.map(c => c.name) }
            selectedCategoryId={ selectedCategoryId }
            onSelect={ onCategoryChange }
            isLoading={ isPlaceholderData }
          />
        ) }

        <FilterInput
          initialValue={ filterQuery }
          onChange={ onSearchInputChange }
          marginBottom={{ base: '4', lg: '6' }}
          w="100%"
          placeholder="Find app"
          isLoading={ isPlaceholderData }
        />
      </Box>

      <MarketplaceList
        apps={ displayedApps }
        onAppClick={ showAppInfo }
        favoriteApps={ favoriteApps }
        onFavoriteClick={ onFavoriteClick }
        isLoading={ isPlaceholderData }
        showDisclaimer={ showDisclaimer }
        selectedCategoryId={ selectedCategoryId }
      />

      { (selectedApp && isAppInfoModalOpen) && (
        <MarketplaceAppModal
          onClose={ clearSelectedAppId }
          isFavorite={ favoriteApps.includes(selectedApp.id) }
          onFavoriteClick={ onFavoriteClick }
          data={ selectedApp }
        />
      ) }

      { (selectedApp && isDisclaimerModalOpen) && (
        <MarketplaceDisclaimerModal
          isOpen={ isDisclaimerModalOpen }
          onClose={ clearSelectedAppId }
          appId={ selectedApp.id }
        />
      ) }
    </>
  );
};

export default Marketplace;
