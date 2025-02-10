import { Text, Flex } from '@chakra-ui/react';
import React from 'react';

import type { SearchResultBlock } from 'types/client/search';

import IconSvg from 'ui/shared/IconSvg';

interface Props {
  data: SearchResultBlock;
  isMobile: boolean | undefined;
  searchTerm: string;
  isFirst?: boolean;
}

const SearchBarSuggestBlock = ({ data, isMobile, isFirst }: Props) => {
  const blockNumber = (
    <Flex fontWeight={ 500 } lineHeight="20px" fontSize={ 14 }>
      <Text color="#000">Block Height:&nbsp;</Text>
      <Text color="#FF57B7">{ data.block_number.toString() }</Text>
    </Flex>
  );

  if (isMobile) {
    return (
      <Flex alignItems="center">
        <IconSvg w="24px" h="24px" mr="8px" color="#DCD4FF" name="block_slim"/>
        { blockNumber }
      </Flex>
    );
  }

  return (
    <Flex justifyContent="space-between">
      <Flex alignItems="center">
        <IconSvg w="24px" h="24px" mr="8px" color="#DCD4FF" name="block_slim"/>
        { blockNumber }
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

export default React.memo(SearchBarSuggestBlock);
