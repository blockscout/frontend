// SPDX-License-Identifier: LicenseRef-Blockscout

import { createListCollection, Flex } from '@chakra-ui/react';
import React from 'react';
import type { MouseEvent } from 'react';

import { MarketplaceCategory } from 'src/features/marketplace/types/client';
import type { TabItemRegular } from 'src/toolkit/components/AdaptiveTabs/types';

import ActionBar from 'src/shell/page/action-bar/ActionBar';
import PageTitle from 'src/shell/page/title/PageTitle';

import useGraphLinks from 'src/features/marketplace/hooks/useGraphLinks';

import config from 'src/config';
import throwOnResourceLoadError from 'src/shared/errors/throw-on-resource-load-error';
import useIsMobile from 'src/shared/hooks/useIsMobile';
import Sort from 'src/shared/sort/Sort';
import SpriteIcon from 'src/sprite/SpriteIcon';
import type { IconName } from 'src/sprite/SpriteIcon';

import { Heading } from 'src/toolkit/chakra/heading';
import { IconButton } from 'src/toolkit/chakra/icon-button';
import { Link } from 'src/toolkit/chakra/link';
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from 'src/toolkit/chakra/menu';
import AdaptiveTabs from 'src/toolkit/components/AdaptiveTabs/AdaptiveTabs';
import { FilterInput } from 'src/toolkit/components/filters/FilterInput';

import MarketplaceDisclaimerModal from '../../components/MarketplaceDisclaimerModal';
import useMarketplace from '../../hooks/useMarketplace';
import { isDisclaimerShown } from '../../utils/disclaimer-modal';
import type { SortValue } from '../../utils/sort';
import { SORT_OPTIONS } from '../../utils/sort';
import Banner from './banner/Banner';
import EssentialDappsList from './essential-dapps/EssentialDappsList';
import MarketplaceList from './MarketplaceList';

const sortCollection = createListCollection({ items: SORT_OPTIONS });

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
    apps,
    displayedApps,
    selectedAppId,
    clearSelectedAppId,
    favoriteApps,
    onFavoriteClick,
    isDisclaimerModalOpen,
    showDisclaimer,
    appsTotal,
    isCategoriesPlaceholderData,
    setSorting,
  } = useMarketplace();

  const isMobile = useIsMobile();

  const graphLinksQuery = useGraphLinks();

  const categoryTabs = React.useMemo(() => {
    const tabs: Array<TabItemRegular> = categories.map(category => ({
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
      title: () => <SpriteIcon name="heart_filled" boxSize={ 5 }/>,
      count: favoriteApps.length,
      component: null,
    });

    return tabs;
  }, [ categories, appsTotal, favoriteApps.length ]);

  const selectedTabId = React.useMemo(() => {
    const tab = categoryTabs.find(c => c.id === selectedCategoryId);
    return typeof tab?.id === 'string' ? tab.id : undefined;
  }, [ categoryTabs, selectedCategoryId ]);

  const selectedApp = displayedApps.find(app => app.id === selectedAppId);

  const handleCategoryChange = React.useCallback(({ value }: { value: string }) => {
    const tabId = categoryTabs.find(c => c.id === value)?.id;
    if (typeof tabId === 'string') {
      onCategoryChange(tabId);
    }
  }, [ categoryTabs, onCategoryChange ]);

  const handleAppClick = React.useCallback((event: MouseEvent, id: string) => {
    if (!isDisclaimerShown()) {
      event.preventDefault();
      showDisclaimer(id);
    }
  }, [ showDisclaimer ]);

  const handleSortChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setSorting(value[0] as SortValue);
  }, [ setSorting ]);

  throwOnResourceLoadError(isError && error ? { isError, error } : { isError: false, error: null });

  if (!feature.isEnabled) {
    return null;
  }

  const showSort = SORT_OPTIONS.length > 1;

  return (
    <>
      <PageTitle
        title={ feature.titles.title }
        contentAfter={ (isMobile && links.length > 1) ? (
          <MenuRoot>
            <MenuTrigger asChild>
              <IconButton
                variant="icon_background"
                size="md"
                ml="auto"
              >
                <SpriteIcon name="dots"/>
              </IconButton>
            </MenuTrigger>
            <MenuContent zIndex="banner">
              { links.map(({ label, href, icon }) => (
                <MenuItem key={ label } value={ label } asChild>
                  <Link external href={ href } variant="menu" gap={ 0 }>
                    <SpriteIcon name={ icon } boxSize={ 4 } mr={ 2 }/>
                    { label }
                  </Link>
                </MenuItem>
              )) }
            </MenuContent>
          </MenuRoot>
        ) : (
          <Flex ml="auto">
            { links.map(({ label, href }) => (
              <Link external key={ label } href={ href } variant="underlaid" textStyle="sm" ml={ 2 }>
                { label }
              </Link>
            )) }
          </Flex>
        ) }
      />

      <Banner
        apps={ apps }
        favoriteApps={ favoriteApps }
        isLoading={ isPlaceholderData }
        onFavoriteClick={ onFavoriteClick }
        onAppClick={ handleAppClick }
      />

      { feature.essentialDapps && (
        <>
          <Heading level="2" mb={ 6 } mt={ 8 }>
            { feature.titles.subtitle_essential_dapps }
          </Heading>
          <EssentialDappsList/>
          <Heading level="2">
            { feature.titles.subtitle_list }
          </Heading>
        </>
      ) }

      <ActionBar
        showShadow
        display="flex"
        flexDirection="column"
        mt={ 0 }
        mx={{ base: -3, lg: -12 }}
        px={{ base: 3, lg: 12 }}
        pt={{ base: 4, lg: 6 }}
        pb={{ base: 4, lg: 3 }}
      >
        <AdaptiveTabs
          tabs={ categoryTabs }
          onValueChange={ handleCategoryChange }
          defaultValue={ selectedTabId }
          marginBottom={ -2 }
          isLoading={ isCategoriesPlaceholderData }
        />

        <Flex gap={{ base: 2, lg: 3 }}>
          { showSort && (
            <Sort
              name="dapps_sorting"
              collection={ sortCollection }
              onValueChange={ handleSortChange }
              defaultValue={ [ sortCollection.items[0].value ] }
              isLoading={ isPlaceholderData }
            />
          ) }
          <FilterInput
            initialValue={ filterQuery }
            onChange={ onSearchInputChange }
            placeholder="Find app by name or keyword..."
            loading={ isPlaceholderData }
            size="sm"
            w={{ base: '100%', lg: '350px' }}
          />
        </Flex>
      </ActionBar>

      <MarketplaceList
        apps={ displayedApps }
        favoriteApps={ favoriteApps }
        onFavoriteClick={ onFavoriteClick }
        isLoading={ isPlaceholderData }
        selectedCategoryId={ selectedCategoryId }
        onAppClick={ handleAppClick }
        graphLinksQuery={ graphLinksQuery }
      />

      { (selectedApp && isDisclaimerModalOpen) && (
        <MarketplaceDisclaimerModal
          isOpen={ isDisclaimerModalOpen }
          onClose={ clearSelectedAppId }
          appId={ selectedApp.id }
          external={ selectedApp.external }
          url={ selectedApp.url }
        />
      ) }
    </>
  );
};

export default Marketplace;
