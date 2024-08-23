import { Box, Flex, Tab, TabList, Tabs, Text, useColorModeValue } from '@chakra-ui/react';
import throttle from 'lodash/throttle';
import React from 'react';
import { Element } from 'react-scroll';

import type { SearchResultItem } from 'types/api/search';

import useIsMobile from 'lib/hooks/useIsMobile';
import useMarketplaceApps from 'ui/marketplace/useMarketplaceApps';
import TextAd from 'ui/shared/ad/TextAd';
import ContentLoader from 'ui/shared/ContentLoader';
import IconSvg from 'ui/shared/IconSvg';
import type { ApiCategory, ItemsCategoriesMap } from 'ui/shared/search/utils';
import { getItemCategoryForGraphql, searchCategories } from 'ui/shared/search/utils';

import SearchBarSuggestApp from './SearchBarSuggestApp';
import SearchBarSuggestItem from './SearchBarSuggestItem';

interface Props {
  query: any;
  searchTerm: string;
  onItemClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  containerId: string;
  setType: (type: string) => void;
  showMoreClicked: boolean;
}

const SearchBarSuggestStorage = ({ query, searchTerm, onItemClick, containerId, setType, showMoreClicked }: Props) => {
  const isMobile = useIsMobile();

  const marketplaceApps = useMarketplaceApps(searchTerm);

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

    Object.entries(query.data).forEach(([ key, value ]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          const cat = getItemCategoryForGraphql(key) as ApiCategory;
          if (cat) {
            (item as any).type = cat;
            if (cat in map) {
              map[cat]?.push(item as SearchResultItem);
            } else {
              map[cat] = [ item as SearchResultItem ];
            }
          }
        });
      }
    });

    if (marketplaceApps.displayedApps.length) {
      map.app = marketplaceApps.displayedApps;
    }
    return map;
  }, [ query.data, marketplaceApps.displayedApps ]);

  React.useEffect(() => {
    categoriesRefs.current = Array(Object.keys(itemsGroups).length).fill('').map((_, i) => categoriesRefs.current[i] || React.createRef());
  }, [ itemsGroups ]);

  // const scrollToCategory = React.useCallback((index: number) => () => {
  //   setTabIndex(index);
  //   scroller.scrollTo(`cat_${ index }`, {
  //     duration: 250,
  //     smooth: true,
  //     offset: -(tabsRef.current?.clientHeight || 0),
  //     containerId: containerId,
  //   });
  // }, [ containerId ]);

  const bgColor = useColorModeValue('white', 'gray.900');

  const handleShowMoreClk = React.useCallback((type: string) => () => {
    setType(type);
  }, [ setType ]);

  const content = (() => {
    if (query.loading || marketplaceApps.isPlaceholderData) {
      return <ContentLoader text="We are searching, please wait... " fontSize="sm"/>;
    }

    if (query.error) {
      return <Text>Something went wrong. Try refreshing the page or come back later.</Text>;
    }

    const resultCategories = searchCategories.filter(cat => itemsGroups[cat.id as keyof ItemsCategoriesMap]);
    if (resultCategories.length === 0) {
      return <Text>No results found.</Text>;
    }

    return (
      <>
        { resultCategories.length > 1 && (
          <Box position="sticky" top="0" width="100%" background={ bgColor } py={ 5 } my={ -5 } ref={ tabsRef }>
            <Tabs variant="outline" colorScheme="gray" size="sm" index={ tabIndex }>
              <TabList columnGap={ 3 } rowGap={ 2 } flexWrap="wrap">
                { resultCategories.map((cat, index) => (
                  <Tab key={ cat.id } onClick={ handleShowMoreClk(cat.id) } { ...(tabIndex === index ? { 'data-selected': 'true' } : {}) }>
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
                ref={ (el: HTMLParagraphElement) => categoriesRefs.current[indx] = el }
              >
                { cat.title }
              </Text>
              { cat.id !== 'app' && (showMoreClicked ?
                itemsGroups[cat.id] :
                itemsGroups[cat.id]?.slice(0, 5)
              )?.map((item, index) => (
                <SearchBarSuggestItem
                  key={ index }
                  isFirst={ index === 0 }
                  data={ item }
                  isMobile={ isMobile }
                  searchTerm={ searchTerm }
                  onClick={ onItemClick }/>
              ),
              ) }
              { cat.id === 'app' && itemsGroups[cat.id]?.map((item, index) =>
                <SearchBarSuggestApp key={ index } data={ item } isMobile={ isMobile } searchTerm={ searchTerm } onClick={ onItemClick }/>,
              ) }
              {
                cat.id && !showMoreClicked && (itemsGroups[cat.id] as Array<any>).length >= 6 ? (
                  <Flex
                    mt="12px"
                    cursor="pointer"
                    flexDirection="row"
                    alignContent="center"
                    justifyContent="center"
                    onClick={ handleShowMoreClk(cat.id) }
                  >
                    <Text
                      fontSize="12px"
                      fontWeight="500"
                      lineHeight="16px"
                      color="rgba(0, 0, 0, 0.40)"
                    >Show More</Text>
                    <IconSvg name="arrows/east" w="16px" h="16px" ml="4px" color="rgba(0, 0, 0, 0.40)"/>
                  </Flex>
                ) : null
              }
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

export default SearchBarSuggestStorage;