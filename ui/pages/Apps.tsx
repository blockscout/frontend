import { Box, Icon, Link } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app/config';
import PlusIcon from 'icons/plus.svg';
import AppList from 'ui/apps/AppList';
import AppListSkeleton from 'ui/apps/AppListSkeleton';
import AppModal from 'ui/apps/AppModal';
import CategoriesMenu from 'ui/apps/CategoriesMenu';
import FilterInput from 'ui/shared/filters/FilterInput';

import useMarketplaceApps from '../apps/useMarketplaceApps';

const Apps = () => {
  const {
    isLoading,
    isError,
    error,
    selectedCategoryId,
    categories,
    onCategoryChange,
    onSearchInputChange,
    showAppInfo,
    displayedApps,
    selectedAppId,
    clearSelectedAppId,
    favoriteApps,
    onFavoriteClick,
  } = useMarketplaceApps();

  if (isError) {
    throw new Error('Unable to get apps list', { cause: error });
  }

  const selectedApp = displayedApps.find(app => app.id === selectedAppId);

  return (
    <>
      <Box
        display="flex"
        flexDirection={{ base: 'column', sm: 'row' }}
      >
        <CategoriesMenu
          categories={ categories }
          selectedCategoryId={ selectedCategoryId }
          onSelect={ onCategoryChange }
        />

        <FilterInput onChange={ onSearchInputChange } marginBottom={{ base: '4', lg: '6' }} placeholder="Find app"/>
      </Box>

      { isLoading ? <AppListSkeleton/> : (
        <AppList
          apps={ displayedApps }
          onAppClick={ showAppInfo }
          favoriteApps={ favoriteApps }
          onFavoriteClick={ onFavoriteClick }
        />
      ) }

      { selectedApp && (
        <AppModal
          onClose={ clearSelectedAppId }
          isFavorite={ favoriteApps.includes(selectedApp.id) }
          onFavoriteClick={ onFavoriteClick }
          data={ selectedApp }
        />
      ) }

      { config.marketplaceSubmitForm && (
        <Link
          fontWeight="bold"
          display="inline-flex"
          alignItems="baseline"
          marginTop={{ base: 8, sm: 16 }}
          href={ config.marketplaceSubmitForm }
          isExternal
        >
          <Icon
            as={ PlusIcon }
            w={ 3 }
            h={ 3 }
            mr={ 2 }
          />

            Submit an App
        </Link>
      ) }
    </>
  );
};

export default Apps;
