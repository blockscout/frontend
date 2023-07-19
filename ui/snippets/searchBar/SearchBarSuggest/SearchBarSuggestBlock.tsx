import { Text, Icon, Flex, Grid } from '@chakra-ui/react';
import React from 'react';

import type { SearchResultBlock } from 'types/api/search';

import blockIcon from 'icons/block.svg';
import dayjs from 'lib/date/dayjs';
import highlightText from 'lib/highlightText';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

interface Props {
  data: SearchResultBlock;
  isMobile: boolean | undefined;
  searchTerm: string;
}

const SearchBarSuggestBlock = ({ data, isMobile, searchTerm }: Props) => {
  const shouldHighlightHash = data.block_hash.toLowerCase() === searchTerm.toLowerCase();

  if (isMobile) {
    return (
      <>
        <Flex alignItems="center">
          <Icon as={ blockIcon } boxSize={ 6 } mr={ 2 } color="gray.500"/>
          <Text
            fontWeight={ 700 }
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
          >
            <span dangerouslySetInnerHTML={{ __html: highlightText(data.block_number.toString(), searchTerm) }}/>
          </Text>
        </Flex>
        <Text variant="secondary" overflow="hidden" whiteSpace="nowrap" as={ shouldHighlightHash ? 'mark' : 'span' } display="block">
          <HashStringShortenDynamic hash={ data.block_hash } isTooltipDisabled/>
        </Text>
        <Text variant="secondary">{ dayjs(data.timestamp).format('llll') }</Text>
      </>
    );
  }

  return (
    <Grid templateColumns="24px auto minmax(auto, max-content) auto" gap={ 2 }>
      <Icon as={ blockIcon } boxSize={ 6 } color="gray.500"/>
      <Text
        fontWeight={ 700 }
        overflow="hidden"
        whiteSpace="nowrap"
        textOverflow="ellipsis"
        w="200px"
      >
        <span dangerouslySetInnerHTML={{ __html: highlightText(data.block_number.toString(), searchTerm) }}/>
      </Text>
      <Text
        variant="secondary"
        overflow="hidden"
        whiteSpace="nowrap"
        as={ shouldHighlightHash ? 'mark' : 'span' }
        display="block"
      >
        <HashStringShortenDynamic hash={ data.block_hash } isTooltipDisabled/>
      </Text>
      <Text variant="secondary" textAlign="end">{ dayjs(data.timestamp).format('llll') }</Text>
    </Grid>
  );
};

export default React.memo(SearchBarSuggestBlock);
