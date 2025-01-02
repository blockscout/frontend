import { Box, Tab, TabList, Tabs, Text, useColorModeValue } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import throttle from 'lodash/throttle';
import React from 'react';
import { scroller, Element } from 'react-scroll';

import type { SearchResultItem } from 'types/api/search';

import type { ResourceError } from 'lib/api/resources';
import { useSettingsContext } from 'lib/contexts/settings';
import useIsMobile from 'lib/hooks/useIsMobile';
import * as regexp from 'lib/regexp';
import useMarketplaceApps from 'ui/marketplace/useMarketplaceApps';
import TextAd from 'ui/shared/ad/TextAd';
import ContentLoader from 'ui/shared/ContentLoader';
import type { ApiCategory, ItemsCategoriesMap } from 'ui/shared/search/utils';
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

  const [ tabIndex, setTabIndex ] = React.useState(0);

  const handleScroll = React.useCallback(() => {
    const container = document.getElementById(containerId);
    if (!container || !query.data?.length) {
      return;
    }
    const topLimit = container.getBoundingClientRect().y + (tabsRef.current?.clientHeight || 0) + 24;
    if (categoriesRefs.current[categoriesRefs.current.length - 1].getBoundingClientRect().y <= topLimit) {
      setTabIndex(categoriesRefs.current.length - 1);
      return;
    }
    for (let i = 0; i < categoriesRefs.current.length - 1; i++) {
      if (categoriesRefs.current[i].getBoundingClientRect().y <= topLimit && categoriesRefs.current[i + 1].getBoundingClientRect().y > topLimit) {
        setTabIndex(i);
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
  }, [ itemsGroups ]);

  const scrollToCategory = React.useCallback((index: number) => () => {
    setTabIndex(index);
    scroller.scrollTo(`cat_${ index }`, {
      duration: 250,
      smooth: true,
      offset: -(tabsRef.current?.clientHeight || 0),
      containerId: containerId,
    });
  }, [ containerId ]);

  const bgColor = useColorModeValue('white', 'gray.900');

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
          <Box position="sticky" top="0" width="100%" background={ bgColor } py={ 5 } my={ -5 } ref={ tabsRef }>
            <Tabs variant="outline" colorScheme="gray" size="sm" index={ tabIndex }>
              <TabList columnGap={ 3 } rowGap={ 2 } flexWrap="wrap">
                { resultCategories.map((cat, index) => (
                  <Tab key={ cat.id } onClick={ scrollToCategory(index) } { ...(tabIndex === index ? { 'data-selected': 'true' } : {}) }>
                    { cat.title }
                  </Tab>
                )) }
              </TabList>
            </Tabs>
          </Box>
        ) }
        { resultCategories.map((cat, indx) => {
          return (
            <Element name={ `cat_${ indx }` } key={ cat.id }>
              <Text
                fontSize="sm"
                fontWeight={ 600 }
                variant="secondary"
                mt={ 6 }
                mb={ 3 }
                ref={ (el: HTMLParagraphElement) => {
                  categoriesRefs.current[indx] = el;
                } }
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
        <Box pb={ 4 } mb={ 5 } borderColor="divider" borderBottomWidth="1px" _empty={{ display: 'none' }}>
          <TextAd/>
        </Box>
      ) }
      { content }
    </Box>
  );
};

export default SearchBarSuggest;
