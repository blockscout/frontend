import { Text, Flex, Grid } from '@chakra-ui/react';
import React from 'react';

import type { SearchResultBlock } from 'types/api/search';

import dayjs from 'lib/date/dayjs';
import highlightText from 'lib/highlightText';
import * as BlockEntity from 'ui/shared/entities/block/BlockEntity';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

interface Props {
  data: SearchResultBlock;
  isMobile: boolean | undefined;
  searchTerm: string;
}

const SearchBarSuggestBlock = ({ data, isMobile, searchTerm }: Props) => {
  const icon = <BlockEntity.Icon/>;
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
        <Flex alignItems="center">
          { icon }
          { blockNumber }
        </Flex>
        { hash }
        <Text variant="secondary">{ date }</Text>
      </>
    );
  }

  return (
    <Grid templateColumns="228px minmax(auto, max-content) auto" gap={ 2 }>
      <Flex alignItems="center">
        { icon }
        { blockNumber }
      </Flex>
      { hash }
      <Text variant="secondary" textAlign="end">{ date }</Text>
    </Grid>
  );
};

export default React.memo(SearchBarSuggestBlock);
