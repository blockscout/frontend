import { Text } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { SearchResult } from 'types/api/search';

import useIsMobile from 'lib/hooks/useIsMobile';
import ContentLoader from 'ui/shared/ContentLoader';

import SearchBarSuggestItem from './SearchBarSuggestItem';

interface Props {
  query: UseQueryResult<SearchResult>;
  searchTerm: string;
}

const SearchBarSuggest = ({ query, searchTerm }: Props) => {
  const isMobile = useIsMobile();

  const content = (() => {
    if (query.isLoading) {
      return <ContentLoader text="We are searching, please wait... "/>;
    }

    if (query.isError) {
      return <Text>Something went wrong. Try refreshing the page or come back later.</Text>;
    }

    const num = query.data.next_page_params ? '50+' : query.data.items.length;

    return (
      <>
        <Text fontWeight={ 500 } fontSize="sm">Found <Text fontWeight={ 700 } as="span">{ num }</Text> matching results</Text>
        { query.data.items.map((item, index) => <SearchBarSuggestItem key={ index } data={ item } isMobile={ isMobile } searchTerm={ searchTerm }/>) }
      </>
    );
  })();

  return content;
};

export default SearchBarSuggest;
