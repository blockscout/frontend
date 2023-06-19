import { Box, Text } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import _uniqBy from 'lodash/uniqBy';
import React from 'react';

import type { SearchRedirectResult, SearchResultItem } from 'types/api/search';

import useIsMobile from 'lib/hooks/useIsMobile';
import TextAd from 'ui/shared/ad/TextAd';
import ContentLoader from 'ui/shared/ContentLoader';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';

import SearchBarSuggestItem from './SearchBarSuggestItem';

const getUniqueIdentifier = (item: SearchResultItem) => {
  switch (item.type) {
    case 'contract':
    case 'address': {
      return item.address;
    }
    case 'transaction': {
      return item.tx_hash;
    }
    case 'block': {
      return item.block_hash || item.block_number;
    }
    case 'token': {
      return item.address;
    }
  }
};

interface Props {
  query: QueryWithPagesResult<'search'>;
  redirectCheckQuery: UseQueryResult<SearchRedirectResult>;
  searchTerm: string;
  onItemClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const SearchBarSuggest = ({ query, redirectCheckQuery, searchTerm, onItemClick }: Props) => {
  const isMobile = useIsMobile();

  const simpleMatch: SearchResultItem | undefined = React.useMemo(() => {
    if (!redirectCheckQuery.data || !redirectCheckQuery.data.redirect || !redirectCheckQuery.data.parameter) {
      return;
    }

    switch (redirectCheckQuery.data?.type) {
      case 'address': {
        return {
          type: 'address',
          name: '',
          address: redirectCheckQuery.data.parameter,
        };
      }
      case 'transaction': {
        return {
          type: 'transaction',
          tx_hash: redirectCheckQuery.data.parameter,
        };
      }
    }
  }, [ redirectCheckQuery.data ]);

  const items = React.useMemo(() => {
    return _uniqBy(
      [
        simpleMatch,
        ...(query.data?.items || []),
      ].filter(Boolean),
      getUniqueIdentifier,
    );
  }, [ query.data?.items, simpleMatch ]);

  const content = (() => {
    if (query.isLoading && !simpleMatch) {
      return <ContentLoader text="We are searching, please wait... " fontSize="sm"/>;
    }

    if (query.isError && !simpleMatch) {
      return <Text>Something went wrong. Try refreshing the page or come back later.</Text>;
    }

    const num = query.data?.next_page_params ? '50+' : items.length;
    const resultText = items.length > 1 || query.pagination.page > 1 ? 'results' : 'result';

    return (
      <>
        <Text fontWeight={ 500 } fontSize="sm">Found <Text fontWeight={ 700 } as="span">{ num }</Text> matching { resultText }</Text>
        { items.map((item, index) =>
          <SearchBarSuggestItem key={ index } data={ item } isMobile={ isMobile } searchTerm={ searchTerm } onClick={ onItemClick }/>) }
        { query.isLoading && <ContentLoader text="We are still searching, please wait... " fontSize="sm" mt={ 5 }/> }
      </>
    );
  })();

  return (
    <>
      { !isMobile && (
        <Box pb={ 4 } mb={ 5 } borderColor="divider" borderBottomWidth="1px" _empty={{ display: 'none' }}>
          <TextAd/>
        </Box>
      ) }
      { content }
    </>
  );
};

export default SearchBarSuggest;
