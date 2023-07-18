import { Box, Tab, TabList, Tabs, Text, useColorModeValue } from '@chakra-ui/react';
import throttle from 'lodash/throttle';
import React from 'react';
import { scroller, Element } from 'react-scroll';

import type { SearchResultItem } from 'types/api/search';

import useIsMobile from 'lib/hooks/useIsMobile';
import TextAd from 'ui/shared/ad/TextAd';
import ContentLoader from 'ui/shared/ContentLoader';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';

import SearchBarSuggestItem from './SearchBarSuggestItem';

type Category = 'token' | 'nft' | 'address' | 'app' | 'public_tag' | 'transaction' | 'block';

const CATEGORIES: Array<{id: Category; title: string }> = [
  { id: 'token', title: 'Tokens (ERC-20)' },
  { id: 'nft', title: 'NFTs (ERC-721 & ERC-1155)' },
  { id: 'address', title: 'Addresses' },
  { id: 'app', title: 'Apps' },
  { id: 'public_tag', title: 'Public tags' },
  { id: 'transaction', title: 'Transactions' },
  { id: 'block', title: 'Blocks' },
];

const getItemCategory = (item: SearchResultItem): Category | undefined => {
  switch (item.type) {
    case 'address':
    case 'contract': {
      return 'address';
    }
    case 'token': {
      if (item.token_type === 'ERC-20') {
        return 'token';
      }
      return 'nft';
    }
    case 'block': {
      return 'block';
    }
    case 'label': {
      return 'public_tag';
    }
    case 'transaction': {
      return 'transaction';
    }
  }
};

interface Props {
  query: QueryWithPagesResult<'search'>;
  searchTerm: string;
  onItemClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  containerId: string;
}

// eslint-disable-next-line import-helpers/order-imports
import * as searchMock from 'mocks/search/index';

const mock = [
  searchMock.address1,
  searchMock.block1,
  searchMock.contract1,
  searchMock.label1,
  searchMock.token1,
  searchMock.token2,
  searchMock.tx1,
  searchMock.address1,
  searchMock.block1,
  searchMock.block1,
  searchMock.block1,
  searchMock.block1,
  searchMock.block1,
  searchMock.block1,
  searchMock.block1,
  searchMock.block1,
  searchMock.block1,
  searchMock.contract1,
  searchMock.label1,
  searchMock.token1,
  searchMock.token2,
  searchMock.tx1,
  searchMock.address1,
  searchMock.block1,
  searchMock.contract1,
  searchMock.label1,
  searchMock.token1,
  searchMock.token2,
];

const SearchBarSuggest = ({ query, searchTerm, onItemClick, containerId }: Props) => {
  const isMobile = useIsMobile();

  const categoriesRefs = React.useRef<Array<HTMLParagraphElement>>([]);
  const tabsRef = React.useRef<HTMLDivElement>(null);

  const [ tabIndex, setTabIndex ] = React.useState(0);

  const handleScroll = React.useCallback(() => {
    const container = document.getElementById(containerId);
    if (!container || !query.data?.items.length) {
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
  }, [ containerId, query.data?.items ]);

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
    if (!query.data?.items) {
      return {};
    }
    const map: Partial<Record<Category, Array<SearchResultItem>>> = {};
    // query.data?.items.forEach(item => {
    mock.forEach(item => {
      const cat = getItemCategory(item);
      if (cat) {
        if (cat in map) {
          map[cat]?.push(item);
        } else {
          map[cat] = [ item ];
        }
      }
    });
    return map;
  }, [ query.data?.items ]);

  const scrollToCategory = React.useCallback((index: number) => {
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
    if (query.isLoading) {
      return <ContentLoader text="We are searching, please wait... " fontSize="sm"/>;
    }

    if (query.isError) {
      return <Text>Something went wrong. Try refreshing the page or come back later.</Text>;
    }

    const resultCategories = CATEGORIES.filter(cat => itemsGroups[cat.id]);

    return (
      <>
        { resultCategories.length > 1 && (
          <Box position="sticky" top="0" width="100%" background={ bgColor } py={ 5 } my={ -5 } ref={ tabsRef }>
            <Tabs variant="outline" colorScheme="gray" size="sm" onChange={ scrollToCategory } index={ tabIndex }>
              <TabList columnGap={ 3 } rowGap={ 2 } flexWrap="wrap">
                { resultCategories.map(cat => <Tab key={ cat.id }>{ cat.title }</Tab>) }
              </TabList>
            </Tabs>
          </Box>
        ) }
        { resultCategories.map((cat, indx) => {
          return (
            <Element name={ `cat_${ indx }` } key={ indx }>
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
              { itemsGroups[cat.id]?.map((item, index) =>
                <SearchBarSuggestItem key={ index } data={ item } isMobile={ isMobile } searchTerm={ searchTerm } onClick={ onItemClick }/>,
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
