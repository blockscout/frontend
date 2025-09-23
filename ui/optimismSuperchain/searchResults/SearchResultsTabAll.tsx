import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import SearchResultsList from './SearchRestultsList';
import type { QueryType, SearchQueries } from './utils';
import { SEARCH_TABS_NAMES } from './utils';

interface Props {
  queries: SearchQueries;
}

const SearchResultsTabAll = ({ queries }: Props) => {
  return (
    <Flex flexDir="column" rowGap={ 8 }>
      { Object.entries(queries)
        .filter(([ , query ]) => query.data?.pages?.[0]?.items?.length > 0)
        .filter(([ queryType ]) => SEARCH_TABS_NAMES[queryType as QueryType])
        .map((items) => {
          const queryType = items[0] as QueryType;
          const query = items[1] as SearchQueries[QueryType];

          return (
            <Box key={ queryType }>
              <Text color="text.secondary" fontWeight={ 600 } textStyle="sm" mb={ 2 }>{ SEARCH_TABS_NAMES[queryType] }</Text>
              <SearchResultsList queryType={ queryType } query={ query }/>
            </Box>
          );
        }) }
    </Flex>
  );
};

export default React.memo(SearchResultsTabAll);
