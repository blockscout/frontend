import { Box, Flex, Tab, TabList, Tabs, Text, useColorModeValue } from '@chakra-ui/react';
// import throttle from 'lodash/throttle';
import type { Dispatch, SetStateAction } from 'react';
import React from 'react';
import { Element } from 'react-scroll';

import type { SearchResultItem } from 'types/api/search';

import useIsMobile from 'lib/hooks/useIsMobile';
import useMarketplaceApps from 'ui/marketplace/useMarketplaceApps';
import TextAd from 'ui/shared/ad/TextAd';
import ContentLoader from 'ui/shared/ContentLoader';
import IconSvg from 'ui/shared/IconSvg';
import type { ApiCategory, ItemsCategoriesMap } from 'ui/shared/search/utils';
import { getItemCategory, searchCategories } from 'ui/shared/search/utils';

import SearchBarSuggestApp from './SearchBarSuggestApp';
import SearchBarSuggestItem from './SearchBarSuggestItem';

interface Props {
  query: {
    data: Array<SearchResultItem>;
    isPending: boolean;
    isError: true | Error | undefined;
  };
  searchTerm: string;
  onItemClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  containerId: string;
  setType: Dispatch<SetStateAction<string>>;
  showMoreClicked: boolean;
}

const SearchBarSuggest = ({ query, searchTerm, onItemClick, setType, showMoreClicked }: Props) => {
  const isMobile = useIsMobile();

  const marketplaceApps = useMarketplaceApps(searchTerm);

  const categoriesRefs = React.useRef<Array<HTMLParagraphElement>>([]);
  const tabsRef = React.useRef<HTMLDivElement>(null);

  const [ tabIndex, setTabIndex ] = React.useState(0);
  const [ filterType, setFilterType ] = React.useState('all');
  // setTabIndex(0);
  // const handleScroll = React.useCallback(() => {
  //   const container = document.getElementById(containerId);
  //   if (!container || !query.data?.length) {
  //     return;
  //   }
  //   const topLimit = container.getBoundingClientRect().y + (tabsRef.current?.clientHeight || 0) + 24;
  //   if (categoriesRefs.current[categoriesRefs.current.length - 1].getBoundingClientRect().y <= topLimit) {
  //     setTabIndex(categoriesRefs.current.length - 1);
  //     return;
  //   }
  //   for (let i = 0; i < categoriesRefs.current.length - 1; i++) {
  //     if (i === 0) {
  //       continue;
  //     }
  //     if (categoriesRefs.current[i].getBoundingClientRect().y <= topLimit && categoriesRefs.current[i + 1].getBoundingClientRect().y > topLimit) {
  //       setTabIndex(i);
  //       break;
  //     }
  //   }
  // }, [ containerId, query.data ]);

  // React.useEffect(() => {
  //   const container = document.getElementById(containerId);
  //   const throttledHandleScroll = throttle(handleScroll, 300);
  //   if (container) {
  //     container.addEventListener('scroll', throttledHandleScroll);
  //   }
  //   return () => {
  //     if (container) {
  //       container.removeEventListener('scroll', throttledHandleScroll);
  //     }
  //   };
  // }, [ containerId, handleScroll ]);

  const itemsGroups = React.useMemo(() => {
    if (!query.data && !marketplaceApps.displayedApps) {
      return {};
    }
    const map: Partial<ItemsCategoriesMap> = {};

    if (filterType !== 'all') {
      query.data = query.data.filter((item) => item.type === filterType);
    }

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
    return map;
  }, [ query, marketplaceApps.displayedApps, filterType ]);

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

  const hanleTabClick = React.useCallback((type: string, index: number) => () => {
    setFilterType(type.toLowerCase());
    setTabIndex(index);
  }, [ setFilterType ]);

  const content = (() => {
    if (query.isPending || marketplaceApps.isPlaceholderData) {
      return <ContentLoader pl="12px" text="We are searching, please wait... " fontSize="sm"/>;
    }

    if (query.isError) {
      return <Text pl="12px">Something went wrong. Try refreshing the page or come back later.</Text>;
    }

    const resultCategories = searchCategories.filter(cat => itemsGroups[cat.id]);

    if (resultCategories.length === 0) {
      return <Text pl="12px">No results found.</Text>;
    }

    if (resultCategories.length) {
      resultCategories.unshift({ id: 'all', title: 'All' });
    }

    return (
      <>
        { resultCategories.length > 1 && (
          <Box position="sticky" top="0" width="100%" background={ bgColor } py={ 5 } my={ -5 } pl="12px" ref={ tabsRef }>
            <Tabs variant="outline" colorScheme="gray" size="sm" index={ tabIndex }>
              <TabList columnGap={ 3 } rowGap={ 2 } flexWrap="wrap">
                { resultCategories.map((cat, index) => (
                  <Tab borderRadius="47px"
                    key={ cat.id }
                    onClick={ hanleTabClick(cat.title, index) } { ...(tabIndex === index ? { 'data-selected': 'true' } : {}) }>
                    { cat.title }
                  </Tab>
                )) }
              </TabList>
            </Tabs>
          </Box>
        ) }
        { resultCategories.map((cat, indx) => {
          if (cat.id === 'all') {
            return <> </>;
          }
          return (
            <Element name={ `cat_${ indx }` } key={ cat.id }>
              <Text
                fontSize="sm"
                fontWeight={ 700 }
                color="#000"
                variant="secondary"
                mt={ indx === 1 ? 6 : 2 }
                pb={ 2 }
                px="12px"
                ref={ (el: HTMLParagraphElement) => categoriesRefs.current[indx] = el }
              >
                { cat.title }
              </Text>
              { cat.id !== 'app' && itemsGroups[cat.id]?.map((item, index) => (
                <Box key={ index } px="8px" borderRadius="12px">
                  <SearchBarSuggestItem
                    key={ index }
                    isFirst={
                      indx === 1 && index === 0
                    }
                    data={ item }
                    isMobile={ isMobile }
                    searchTerm={ searchTerm }
                    onClick={ onItemClick }/>
                </Box>
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

export default SearchBarSuggest;
