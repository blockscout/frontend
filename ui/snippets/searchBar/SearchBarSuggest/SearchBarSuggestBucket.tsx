import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

import type { SearchResultBucket } from 'types/api/search';

import IconSvg from 'ui/shared/IconSvg';
import { formatPubKey } from 'ui/storage/utils';

interface Props {
  data: SearchResultBucket;
  searchTerm: string;
  isFirst?: boolean;
}

const SearchBarSuggestBucket = ({ data, isFirst }: Props) => {
  return (
    <Flex justifyContent="space-between">
      <Flex alignItems="center">
        <IconSvg w="24px" h="24px" mr="8px" name="bucket"/>
        <Flex flexDirection="column">
          <Flex fontWeight="500" fontSize={ 14 } lineHeight="20px" alignItems="center">
            <Text color="#000">Bucket ID:&nbsp;</Text>
            <Text color="#8A55FD">{ data.bucket_id }</Text>
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

export default React.memo(SearchBarSuggestBucket);
