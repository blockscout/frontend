import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

import type { SearchResultObject } from 'types/api/search';

import highlightText from 'lib/highlightText';
import IconSvg from 'ui/shared/IconSvg';
import { formatPubKey, isNumberOnly } from 'ui/storage/utils';

interface Props {
  data: SearchResultObject;
  searchTerm: string;
  isFirst?: boolean;
}

const SearchBarSuggestObject = ({ data, searchTerm, isFirst }: Props) => {
  return (
    <Flex justifyContent="space-between">
      <Flex alignItems="center">
        <IconSvg w="24px" h="24px" mr="8px" name="bucket"/>
        <Flex flexDirection="column">
          <Flex>
            <Text color="#000">{ isNumberOnly(searchTerm) && searchTerm === data.object_id ? 'Object ID' : 'Object Name' }:&nbsp;</Text>
            {
              !(isNumberOnly(searchTerm) && data.object_id === searchTerm) ? (
                <span style={{ color: 'rgba(0, 0, 0, 0.30)' }}
                  dangerouslySetInnerHTML={{ __html: highlightText(formatPubKey(data.object_name, 16, 16) || '', searchTerm) }}/>
              ) :
                <Text color="#8A55FD">{ data.object_id }</Text>
            }
          </Flex>
          <Text fontSize={ 12 } color="rgba(0, 0, 0, 0.30)">Owner: { formatPubKey(data.owner_address, 16, 16) }</Text>
        </Flex>
      </Flex>
      {
        isFirst ? (
          <Flex justifyContent="end">
            <IconSvg transform="rotate(-180deg)" float="right" w="24px" h="24px" mr="8px" name="arrows/east"/>
          </Flex>
        ) : null
      }
    </Flex>
  );
};

export default React.memo(SearchBarSuggestObject);
