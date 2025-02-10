import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

import type { SearchResultGroup } from 'types/api/search';

import highlightText from 'lib/highlightText';
import IconSvg from 'ui/shared/IconSvg';
import { formatPubKey, isNumberOnly, truncateString } from 'ui/storage/utils';

interface Props {
  data: SearchResultGroup;
  searchTerm: string;
  isFirst?: boolean;
}

const SearchBarSuggestGroup = ({ data, isFirst, searchTerm }: Props) => {
  return (
    <Flex justifyContent="space-between">
      <Flex alignItems="center">
        <IconSvg w="24px" h="24px" mr="8px" color="#DCD4FF" name="group"/>
        <Flex flexDirection="column">
          <Flex fontWeight="500" fontSize={ 14 } lineHeight="20px" alignItems="center">
            <Text color="#000">{ isNumberOnly(searchTerm) && searchTerm === data.group_id ? 'Group ID' : 'Group Name' }:&nbsp;</Text>
            {
              !(isNumberOnly(searchTerm) && data.group_id === searchTerm) ? (
                <span style={{ color: 'rgba(0, 0, 0, 0.30)' }}
                  dangerouslySetInnerHTML={{ __html: highlightText(truncateString(data.group_name), searchTerm) }}/>
              ) :
                <Text color="#FF57B7">{ truncateString(data.group_id) }</Text>
            }
          </Flex>
          <Text fontSize={ 12 } color="rgba(0, 0, 0, 0.30)">Owner: { formatPubKey(data.owner_address, 16, 16) }</Text>
        </Flex>
      </Flex>
      {
        isFirst ? (
          <Flex justifyContent="end" alignItems="center">
            <IconSvg transform="rotate(-180deg)" float="right" w="24px" h="24px" mr="8px" name="arrows/east"/>
          </Flex>
        ) : null
      }
    </Flex>
  );
};

export default React.memo(SearchBarSuggestGroup);
