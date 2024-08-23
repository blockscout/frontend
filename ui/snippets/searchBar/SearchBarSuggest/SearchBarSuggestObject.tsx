import { Flex, Grid, Tag } from '@chakra-ui/react';
import React from 'react';

import type { SearchResultObject } from 'types/api/search';

import IconSvg from 'ui/shared/IconSvg';

interface Props {
  data: SearchResultObject;
  searchTerm: string;
  isFirst?: boolean;
}

const SearchBarSuggestObject = ({ data, isFirst }: Props) => {
  return (
    <Grid templateColumns="228px minmax(auto, max-content) auto" gap={ 2 }>
      <Flex alignItems="center">
        <IconSvg w="24px" h="24px" mr="8px" name="bucket"/>
        { data.object_name }
      </Flex>
      <Flex columnGap={ 3 } minW={ 0 } alignItems="center">
        <Tag flexShrink={ 0 }>Owner</Tag>
        { data.owner_address }
      </Flex>
      {
        isFirst ? (
          <Flex justifyContent="end">
            <IconSvg transform="rotate(-180deg)" float="right" w="24px" h="24px" mr="8px" name="arrows/east"/>
          </Flex>
        ) : null
      }
    </Grid>
  );
};

export default React.memo(SearchBarSuggestObject);
