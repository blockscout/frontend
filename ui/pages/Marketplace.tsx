import { Box, Link, Skeleton } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import MarketplaceAppModal from 'ui/marketplace/MarketplaceAppModal';
import MarketplaceCategoriesMenu from 'ui/marketplace/MarketplaceCategoriesMenu';
import MarketplaceDisclaimerModal from 'ui/marketplace/MarketplaceDisclaimerModal';
import MarketplaceList from 'ui/marketplace/MarketplaceList';
import FilterInput from 'ui/shared/filters/FilterInput';
import IconSvg from 'ui/shared/IconSvg';

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
  } = useMarketplace();

  if (isError) {
    throw new Error('Unable to get apps list', { cause: error });
  }

  if (!feature.isEnabled) {
    return null;
  }

  const selectedApp = displayedApps.find(app => app.id === selectedAppId);

  return (
    <>
      <Box
        display="flex"
        flexDirection={{ base: 'column', sm: 'row' }}
      >
        <MarketplaceCategoriesMenu
          categories={ categories }
          selectedCategoryId={ selectedCategoryId }
          onSelect={ onCategoryChange }
          isLoading={ isPlaceholderData }
        />

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

      <Skeleton
        isLoaded={ !isPlaceholderData }
        marginTop={{ base: 8, sm: 16 }}
        display="inline-block"
      >
        <Link
          fontWeight="bold"
          display="inline-flex"
          alignItems="baseline"
          href={ feature.submitFormUrl }
          isExternal
        >
          <IconSvg
            name="plus"
            w={ 3 }
            h={ 3 }
            mr={ 2 }
          />

              Submit an app
        </Link>
      </Skeleton>
    </>
  );
};

export default Marketplace;
