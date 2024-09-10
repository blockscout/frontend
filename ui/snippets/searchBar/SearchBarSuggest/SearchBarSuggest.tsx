import { Box, Flex, Tab, TabList, Tabs, Text, useColorModeValue } from '@chakra-ui/react';
// import throttle from 'lodash/throttle';
import type { Dispatch, SetStateAction } from 'react';
import React from 'react';
import { scroller, Element } from 'react-scroll';

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

const SearchBarSuggest = ({ query, searchTerm, onItemClick, setType, showMoreClicked, containerId }: Props) => {
  const isMobile = useIsMobile();

  const marketplaceApps = useMarketplaceApps(searchTerm);

  const categoriesRefs = React.useRef<Array<HTMLParagraphElement>>([]);
  const tabsRef = React.useRef<HTMLDivElement>(null);

  const [ filterType, setFilterType ] = React.useState('all');
  const seletecdTab = React.useRef('all');

  const itemsGroups = React.useMemo(() => {
    if (!query.data && !marketplaceApps.displayedApps) {
      return {};
    }

    const filteredData = filterType !== 'all' ? query.data.filter(
      (item) => item.type === filterType ||
      `${ item.type }s` === filterType ||
      `${ item.type }es` === filterType ||
      (filterType.toLowerCase().startsWith('nfts') && item.type === 'token'),
    ) : query.data;

    const map: Partial<ItemsCategoriesMap> = {};

    filteredData.forEach(item => {
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
  }, [ query.data, marketplaceApps.displayedApps, filterType ]);

  const tabGroups = React.useMemo(() => {
    if (!query.data) {
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
    return map;
  }, [ query.data ]);

  React.useEffect(() => {
    categoriesRefs.current = Array(Object.keys(itemsGroups).length).fill('').map((_, i) => categoriesRefs.current[i] || React.createRef());
  }, [ itemsGroups ]);

  const bgColor = useColorModeValue('white', 'gray.900');

  const hanleTabClick = React.useCallback((type: string) => () => {
    seletecdTab.current = type.toLowerCase();
    if (type === 'all') {
      setType('default');
    }
    setFilterType(type.toLowerCase());
  }, [ setType ]);

  const scrollToTop = React.useCallback(() => {
    scroller.scrollTo(`cat_0`, {
      duration: 250,
      smooth: true,
      offset: -(tabsRef.current?.clientHeight || 0),
      containerId: containerId,
    });
  }, [ containerId ]);

  const handleShowMoreClk = React.useCallback((type: string) => () => {
    hanleTabClick(type)();
    setType(type);
    scrollToTop();
  }, [ hanleTabClick, setType, scrollToTop ]);

  const tabMatched = React.useCallback((type: string) => {
    if (type === seletecdTab.current ||
      `${ type }s` === seletecdTab.current ||
      `${ type }es` === seletecdTab.current ||
      (seletecdTab.current.toLowerCase().startsWith('nfts') && type === 'token')) {
      return true;
    } else {
      return false;
    }
  }, [ seletecdTab ]);

  const content = (() => {
    if (query.isPending || marketplaceApps.isPlaceholderData) {
      return <ContentLoader pl="12px" text="We are searching, please wait... " fontSize="sm"/>;
    }

    if (query.isError) {
      return <Text pl="12px">Something went wrong. Try refreshing the page or come back later.</Text>;
    }

    const resultCategories = searchCategories.filter(cat => itemsGroups[cat.id]);

    const tabCategories = searchCategories.filter(cat => tabGroups[cat.id]);

    if (resultCategories.length === 0) {
      return <Text pl="12px">No results found.</Text>;
    }

    if (tabCategories.length) {
      tabCategories.unshift({ id: 'all', title: 'All' });
    }

    return (
      <>
        { tabCategories.length > 1 && (
          <Box position="sticky" top="0" width="100%" background={ bgColor } py={ 5 } mt={ -5 } pl="12px" ref={ tabsRef } zIndex={ 9 }>
            <Tabs variant="outline" colorScheme="gray" size="sm">
              <TabList columnGap={ 3 } rowGap={ 2 } flexWrap="wrap">
                { tabCategories.map((cat) => (
                  <Tab borderRadius="47px"
                    minWidth="47px"
                    key={ cat.id }
                    onClick={ hanleTabClick(cat.title.toLowerCase()) }
                    style={{
                      backgroundColor: (tabMatched(cat.title.toLowerCase()) ||
                      (cat.title === 'all' && seletecdTab.current === 'all')) ? '#A07EFF' : 'transparent',
                      color: (tabMatched(cat.title.toLowerCase()) ||
                      (cat.title === 'all' && seletecdTab.current === 'all')) ? '#FFF' : '#000',
                      border: (tabMatched(cat.title.toLowerCase()) ||
                      (cat.title === 'all' && seletecdTab.current === 'all')) ? '1px solid rgba(0, 46, 51, 0.10)' : '1px solid rgba(0, 46, 51, 0.10)',
                      fontStyle: 'normal',
                      fontWeight: 400,
                    }}
                  >
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
              { cat.id !== 'app' && ((showMoreClicked ? (itemsGroups[cat.id] || []) : (itemsGroups[cat.id] || []).slice(0, 5))
              ).map((item, index) => (
                <Box key={ index } px="8px" borderRadius="12px">
                  <SearchBarSuggestItem
                    key={ index }
                    isFirst={
                      indx === 0 && index === 0
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
                    onClick={ handleShowMoreClk(cat.title) }
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
