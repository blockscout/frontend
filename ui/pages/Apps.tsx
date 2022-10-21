import { Box, Icon, Link } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { JsonRpcUrlResponse } from 'types/api/json-rpc-url';

import config from 'configs/app/config';
import PlusIcon from 'icons/plus.svg';
import useFetch from 'lib/hooks/useFetch';
import AppList from 'ui/apps/AppList';
import AppListSkeleton from 'ui/apps/AppListSkeleton';
import CategoriesMenu from 'ui/apps/CategoriesMenu';
import FilterInput from 'ui/shared/FilterInput';

import useMarketplaceApps from '../apps/useMarkeplaceApps';

const Apps = () => {
  const fetch = useFetch();

  const {
    isLoading,
    category,
    handleCategoryChange,
    debounceFilterApps,
    showAppInfo,
    displayedApps,
    displayedAppId,
    clearDisplayedAppId,
    favoriteApps,
    handleFavoriteClick,
  } = useMarketplaceApps();

  useQuery<unknown, unknown, JsonRpcUrlResponse>(
    [ 'json-rpc-url' ],
    async() => await fetch(`/api/config/json-rpc-url`),
  );

  return (
    <>
      <Box
        display="flex"
        flexDirection={{ base: 'column', sm: 'row' }}
      >
        <CategoriesMenu
          selectedCategoryId={ category }
          onSelect={ handleCategoryChange }
        />

        <FilterInput onChange={ debounceFilterApps } marginBottom={{ base: '4', lg: '6' }} placeholder="Find app"/>
      </Box>

      { isLoading ? <AppListSkeleton/> : (
        <AppList
          apps={ displayedApps }
          onAppClick={ showAppInfo }
          displayedAppId={ displayedAppId }
          onModalClose={ clearDisplayedAppId }
          favoriteApps={ favoriteApps }
          onFavoriteClick={ handleFavoriteClick }
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
