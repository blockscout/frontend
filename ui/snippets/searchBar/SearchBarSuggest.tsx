import { Box, Text } from '@chakra-ui/react';
import _groupBy from 'lodash/groupBy';
import React from 'react';

import type { SearchResult, SearchResultType } from 'types/api/search';

import useIsMobile from 'lib/hooks/useIsMobile';

import SearchBarSuggestItem from './SearchBarSuggestItem';

interface Props {
  data: SearchResult;
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
];

const SearchBarSuggest = ({ data }: Props) => {
  const isMobile = useIsMobile();
  const groupedData = _groupBy(data.items, 'type');

  return (
    <>
      { Object.entries(groupedData).map(([ group, data ]) => {
        const groupName = GROUPS.find(({ type }) => type === group)?.title;
        return (
          <Box key={ group }>
            <Text variant="secondary" fontSize="sm" fontWeight={ 600 } mb={ 3 }>{ groupName } ({ data.length })</Text>
            { data.map((item, index) => <SearchBarSuggestItem key={ index } data={ item } isMobile={ isMobile }/>) }
          </Box>
        );
      }) }
    </>
  );
};

export default SearchBarSuggest;
