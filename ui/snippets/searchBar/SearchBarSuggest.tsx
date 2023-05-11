import { Text } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import type { Route } from 'nextjs-routes';
import React from 'react';

import type { SearchResult } from 'types/api/search';

import useIsMobile from 'lib/hooks/useIsMobile';
import TextAd from 'ui/shared/ad/TextAd';
import ContentLoader from 'ui/shared/ContentLoader';
import type { Props as PaginationProps } from 'ui/shared/Pagination';

import SearchBarSuggestItem from './SearchBarSuggestItem';

interface Props {
  query: UseQueryResult<SearchResult> & {
    pagination: PaginationProps;
  };
  searchTerm: string;
  pathname: Route['pathname'];
}

const SearchBarSuggest = ({ query, searchTerm, pathname }: Props) => {
  const isMobile = useIsMobile();

  const content = (() => {
    if (query.isLoading) {
      return <ContentLoader text="We are searching, please wait... "/>;
    }

    if (query.isError) {
      return <Text>Something went wrong. Try refreshing the page or come back later.</Text>;
    }

    const num = query.data.next_page_params ? '50+' : query.data.items.length;
    const resultText = query.data.items.length > 1 || query.pagination.page > 1 ? 'results' : 'result';

    return (
      <>
        <Text fontWeight={ 500 } fontSize="sm">Found <Text fontWeight={ 700 } as="span">{ num }</Text> matching { resultText }</Text>
        { query.data.items.map((item, index) =>
          <SearchBarSuggestItem key={ index } data={ item } isMobile={ isMobile } searchTerm={ searchTerm } pathname={ pathname }/>) }
      </>
    );
  })();

  return (
    <>
      { !isMobile && <TextAd pb={ 4 } mb={ 5 } borderColor="divider" borderBottomWidth="1px"/> }
      { content }
    </>
  );
};

export default SearchBarSuggest;
