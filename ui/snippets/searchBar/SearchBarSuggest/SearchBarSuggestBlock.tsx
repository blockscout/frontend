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
  const icon = <Icon as={ blockIcon } boxSize={ 6 } color="gray.500"/>;
  const shouldHighlightHash = data.block_hash.toLowerCase() === searchTerm.toLowerCase();
  const blockNumber = (
    <Text
      fontWeight={ 700 }
      overflow="hidden"
      whiteSpace="nowrap"
      textOverflow="ellipsis"
    >
      <span dangerouslySetInnerHTML={{ __html: highlightText(data.block_number.toString(), searchTerm) }}/>
    </Text>
  );
  const hash = (
    <Text
      variant="secondary"
      overflow="hidden"
      whiteSpace="nowrap"
      as={ shouldHighlightHash ? 'mark' : 'span' }
      display="block"
    >
      <HashStringShortenDynamic hash={ data.block_hash } isTooltipDisabled/>
    </Text>
  );
  const date = dayjs(data.timestamp).format('llll');

  if (isMobile) {
    return (
      <>
        <Flex alignItems="center" gap={ 2 }>
          { icon }
          { blockNumber }
        </Flex>
        { hash }
        <Text variant="secondary">{ date }</Text>
      </>
    );
  }

  return (
    <Grid templateColumns="24px 200px minmax(auto, max-content) auto" gap={ 2 }>
      { icon }
      { blockNumber }
      { hash }
      <Text variant="secondary" textAlign="end">{ date }</Text>
    </Grid>
  );
};

export default React.memo(SearchBarSuggestBlock);
