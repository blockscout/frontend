import { Box, Text } from '@chakra-ui/react';
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
      return <Box>loading...</Box>;
    }

    if (query.isError) {
      return <Box>Something went wrong. Try refreshing the page or come back later.</Box>;
    }

    const num = query.data.next_page_params ? '50+' : query.data.items.length;

    return (
      <>
        <Box fontWeight={ 500 } fontSize="sm">Found <Text fontWeight={ 700 } as="span">{ num }</Text> matching results</Box>
        { query.data.items.map((item, index) => <SearchBarSuggestItem key={ index } data={ item } isMobile={ isMobile } searchTerm={ searchTerm }/>) }
      </>
    );
  })();

  return content;
};

export default SearchBarSuggest;
