import { Box, Menu, MenuButton, MenuItem, MenuList, Flex, IconButton } from '@chakra-ui/react';
import React from 'react';

import { MarketplaceCategory } from 'types/client/marketplace';
import type { TabItem } from 'ui/shared/Tabs/types';

import config from 'configs/app';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import useIsMobile from 'lib/hooks/useIsMobile';
import MarketplaceAppModal from 'ui/marketplace/MarketplaceAppModal';
import MarketplaceDisclaimerModal from 'ui/marketplace/MarketplaceDisclaimerModal';
import MarketplaceList from 'ui/marketplace/MarketplaceList';
import FilterInput from 'ui/shared/filters/FilterInput';
import IconSvg from 'ui/shared/IconSvg';
import type { IconName } from 'ui/shared/IconSvg';
import LinkExternal from 'ui/shared/LinkExternal';
import PageTitle from 'ui/shared/Page/PageTitle';
import TabsSkeleton from 'ui/shared/Tabs/TabsSkeleton';
import TabsWithScroll from 'ui/shared/Tabs/TabsWithScroll';

import useMarketplace from '../marketplace/useMarketplace';
const feature = config.features.marketplace;

const links: Array<{ label: string; href: string; icon: IconName }> = [];
if (feature.isEnabled) {
  if (feature.submitFormUrl) {
    links.push({
      label: 'Submit app',
      href: feature.submitFormUrl,
      icon: 'plus' as IconName,
    });
  }
  if (feature.suggestIdeasFormUrl) {
    links.push({
      label: 'Suggest ideas',
      href: feature.suggestIdeasFormUrl,
      icon: 'edit' as IconName,
    });
  }
}

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
  const isMobile = useIsMobile();

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
      <PageTitle
        title="DAppscout"
        contentAfter={ (isMobile && links.length > 1) ? (
          <Menu>
            <MenuButton
              as={ IconButton }
              size="sm"
              variant="outline"
              colorScheme="gray"
              px="9px"
              ml="auto"
              icon={ <IconSvg name="dots" boxSize="18px"/> }
            />
            <MenuList minW="max-content">
              { links.map(({ label, href, icon }) => (
                <MenuItem key={ label } as="a" href={ href } target="_blank" py={ 2 } px={ 4 }>
                  <IconSvg name={ icon } boxSize={ 4 } mr={ 2.5 }/>
                  { label }
                  <IconSvg name="arrows/north-east" boxSize={ 4 } color="gray.400" ml={ 2 }/>
                </MenuItem>
              )) }
            </MenuList>
          </Menu>
        ) : (
          <Flex ml="auto">
            { links.map(({ label, href }) => (
              <LinkExternal key={ label } href={ href } variant="subtle" fontSize="sm" lineHeight={ 5 } ml={ 2 }>
                { label }
              </LinkExternal>
            )) }
          </Flex>
        ) }
      />
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

      <FilterInput
        initialValue={ filterQuery }
        onChange={ onSearchInputChange }
        marginBottom={{ base: '4', lg: '6' }}
        w="100%"
        placeholder="Find app"
        isLoading={ isPlaceholderData }
      />

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
