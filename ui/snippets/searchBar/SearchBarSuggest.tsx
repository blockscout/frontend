import { Box, Text } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import _groupBy from 'lodash/groupBy';
import React from 'react';

import type { SearchResult, SearchResultType } from 'types/api/search';

import useIsMobile from 'lib/hooks/useIsMobile';

import SearchBarSuggestItem from './SearchBarSuggestItem';

interface Props {
  query: UseQueryResult<SearchResult>;
}

interface Group {
  type: SearchResultType;
  title: string;
}

const GROUPS: Array<Group> = [
  { type: 'block', title: 'Blocks' },
  { type: 'token', title: 'Tokens' },
  { type: 'address', title: 'Address' },
  { type: 'transaction', title: 'Transactions' },
  { type: 'contract', title: 'Contracts' },
];

const SearchBarSuggest = ({ query }: Props) => {
  const isMobile = useIsMobile();
  const groupedData = _groupBy(query.data?.items || [], 'type');

  const content = (() => {
    if (query.isLoading) {
      return <Box>loading...</Box>;
    }

    if (query.isError) {
      return <Box>Something went wrong. Try refreshing the page or come back later.</Box>;
    }

    if (query.data.items.length === 0) {
      return <Box fontWeight={ 500 }>Found <Text fontWeight={ 700 } as="span">0</Text> matching results</Box>;
    }

    return Object.entries(groupedData).map(([ group, data ]) => {
      const groupName = GROUPS.find(({ type }) => type === group)?.title;
      return (
        <Box key={ group }>
          <Text variant="secondary" fontSize="sm" fontWeight={ 600 } mb={ 3 }>{ groupName } ({ data.length })</Text>
          { data.map((item, index) => <SearchBarSuggestItem key={ index } data={ item } isMobile={ isMobile }/>) }
        </Box>
      );
    });
  })();

  return (
    <Box>
      { content }
    </Box>
  );
};

export default SearchBarSuggest;
