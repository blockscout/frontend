import { Box, Text } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { throttle } from 'es-toolkit';
import React from 'react';
import { scroller, Element } from 'react-scroll';

import type { SearchResultItem } from 'types/api/search';

import type { ResourceError } from 'lib/api/resources';
import { useSettingsContext } from 'lib/contexts/settings';
import useIsMobile from 'lib/hooks/useIsMobile';
import { TabsList, TabsRoot, TabsTrigger } from 'toolkit/chakra/tabs';
import * as regexp from 'toolkit/utils/regexp';
import useMarketplaceApps from 'ui/marketplace/useMarketplaceApps';
import TextAd from 'ui/shared/ad/TextAd';
import ContentLoader from 'ui/shared/ContentLoader';
import type { ApiCategory, Category, ItemsCategoriesMap } from 'ui/shared/search/utils';
import { getItemCategory, searchCategories } from 'ui/shared/search/utils';

import SearchBarSuggestApp from './SearchBarSuggestApp';
import SearchBarSuggestBlockCountdown from './SearchBarSuggestBlockCountdown';
import SearchBarSuggestItem from './SearchBarSuggestItem';

interface Props {
  query: UseQueryResult<Array<SearchResultItem>, ResourceError<unknown>>;
  searchTerm: string;
  onItemClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  containerId: string;
}

const SearchBarSuggest = ({ query, searchTerm, onItemClick, containerId }: Props) => {
  const isMobile = useIsMobile();

  const marketplaceApps = useMarketplaceApps(searchTerm);
  const settingsContext = useSettingsContext();

  const categoriesRefs = React.useRef<Array<HTMLParagraphElement>>([]);
  const tabsRef = React.useRef<HTMLDivElement>(null);

  const [ currentTab, setCurrentTab ] = React.useState<Category | undefined>(undefined);

  const handleScroll = React.useCallback(() => {
    const container = document.getElementById(containerId);
    if (!container || !query.data?.length) {
      return;
    }
    const topLimit = container.getBoundingClientRect().y + (tabsRef.current?.clientHeight || 0) + 24;
    if (categoriesRefs.current[categoriesRefs.current.length - 1].getBoundingClientRect().y <= topLimit) {
      const lastCategory = categoriesRefs.current[categoriesRefs.current.length - 1];
      const lastCategoryId = lastCategory.getAttribute('data-id');
      if (lastCategoryId) {
        setCurrentTab(lastCategoryId as Category);
      }
      return;
    }
    for (let i = 0; i < categoriesRefs.current.length - 1; i++) {
      if (categoriesRefs.current[i].getBoundingClientRect().y <= topLimit && categoriesRefs.current[i + 1].getBoundingClientRect().y > topLimit) {
        const currentCategory = categoriesRefs.current[i];
        const currentCategoryId = currentCategory.getAttribute('data-id');
        if (currentCategoryId) {
          setCurrentTab(currentCategoryId as Category);
        }
        break;
      }
    }
  }, [ containerId, query.data ]);

  React.useEffect(() => {
    const container = document.getElementById(containerId);
    const throttledHandleScroll = throttle(handleScroll, 300);
    if (container) {
      container.addEventListener('scroll', throttledHandleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', throttledHandleScroll);
      }
    };
  }, [ containerId, handleScroll ]);

  const itemsGroups = React.useMemo(() => {
    if (!query.data && !marketplaceApps.displayedApps) {
      return {};
    }

    const map: Partial<ItemsCategoriesMap> = {};

    query.data?.forEach(item => {
      const cat = getItemCategory(item) as ApiCategory;
      if (cat) {
        if (cat in map) {
          map[cat]?.push(item);
        } else {
          map[cat] = [ item ];
        }
      }
    });

    if (marketplaceApps.displayedApps.length) {
      map.app = marketplaceApps.displayedApps;
    }

    if (Object.keys(map).length > 0 && !map.block && regexp.BLOCK_HEIGHT.test(searchTerm)) {
      map['block'] = [ {
        type: 'block',
        block_type: 'block',
        block_number: searchTerm,
        block_hash: '',
        timestamp: undefined,
      } ];
    }

    return map;
  }, [ query.data, marketplaceApps.displayedApps, searchTerm ]);

  React.useEffect(() => {
    categoriesRefs.current = Array(Object.keys(itemsGroups).length).fill('').map((_, i) => categoriesRefs.current[i] || React.createRef());
    const resultCategories = searchCategories.filter(cat => itemsGroups[cat.id]);
    setCurrentTab(resultCategories[0]?.id);
  }, [ itemsGroups ]);

  const handleTabsValueChange = React.useCallback(({ value }: { value: string }) => {
    setCurrentTab(value as Category);
    scroller.scrollTo(`cat_${ value }`, {
      duration: 250,
      smooth: true,
      offset: -(tabsRef.current?.clientHeight || 0),
      containerId: containerId,
    });
  }, [ containerId ]);

  const content = (() => {
    if (query.isPending || marketplaceApps.isPlaceholderData) {
      return <ContentLoader text="We are searching, please wait... " fontSize="sm"/>;
    }

    if (query.isError) {
      return <Text>Something went wrong. Try refreshing the page or come back later.</Text>;
    }

    const resultCategories = searchCategories.filter(cat => itemsGroups[cat.id]);

    if (resultCategories.length === 0) {
      if (regexp.BLOCK_HEIGHT.test(searchTerm)) {
        return <SearchBarSuggestBlockCountdown blockHeight={ searchTerm } onClick={ onItemClick }/>;
      }

      return <Text>No results found.</Text>;
    }

    return (
      <>
        { resultCategories.length > 1 && (
          <Box position="sticky" top="0" width="100%" background={{ _light: 'white', _dark: 'gray.900' }} py={ 5 } my={ -5 } ref={ tabsRef } zIndex={ 1 }>
            <TabsRoot
              variant="secondary"
              size="sm"
              value={ currentTab }
              onValueChange={ handleTabsValueChange }
            >
              <TabsList columnGap={ 3 } rowGap={ 2 } flexWrap="wrap">
                { resultCategories.map((cat) => (
                  <TabsTrigger
                    key={ cat.id }
                    value={ cat.id }
                  >
                    { cat.title }
                  </TabsTrigger>
                )) }
              </TabsList>
            </TabsRoot>
          </Box>
        ) }
        { resultCategories.map((cat, index) => {
          return (
            <Element name={ `cat_${ cat.id }` } key={ cat.id }>
              <Text
                textStyle="sm"
                fontWeight={ 600 }
                color="text.secondary"
                mt={ 6 }
                mb={ 3 }
                ref={ (el: HTMLParagraphElement) => {
                  categoriesRefs.current[index] = el;
                } }
                data-id={ cat.id }
              >
                { cat.title }
              </Text>
              { cat.id !== 'app' && itemsGroups[cat.id]?.map((item, index) => (
                <SearchBarSuggestItem
                  key={ index }
                  data={ item }
                  isMobile={ isMobile }
                  searchTerm={ searchTerm }
                  onClick={ onItemClick }
                  addressFormat={ settingsContext?.addressFormat }
                />
              )) }
              { cat.id === 'app' && itemsGroups[cat.id]?.map((item, index) =>
                <SearchBarSuggestApp key={ index } data={ item } isMobile={ isMobile } searchTerm={ searchTerm } onClick={ onItemClick }/>,
              ) }
            </Element>
          );
        }) }
      </>
    );
  })();

  return (
    <Box mt={ 5 } mb={ 5 }>
      { !isMobile && (
        <Box pb={ 4 } mb={ 5 } borderColor="border.divider" borderBottomWidth="1px" _empty={{ display: 'none' }}>
          <TextAd/>
        </Box>
      ) }
      { content }
    </Box>
  );
};

export default SearchBarSuggest;
