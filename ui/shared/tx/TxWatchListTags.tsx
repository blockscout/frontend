import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import Tag from 'ui/shared/chakra/Tag';

interface Props {
  tx: Transaction;
  isLoading?: boolean;
}

const TxWatchListTags = ({ tx, isLoading }: Props) => {
  const tags = [
    ...(tx.from?.watchlist_names || []),
    ...(tx.to?.watchlist_names || []),
  ].filter(Boolean);

  if (tags.length === 0) {
    return null;
  }

  return (
    <Flex columnGap={ 2 } rowGap={ 2 } flexWrap="wrap" overflow="hidden" maxW="100%">
      { tags.map((tag) => (
        <Tag
          key={ tag.label }
          isLoading={ isLoading }
          isTruncated
          // maxW={{ base: '115px', lg: 'initial' }}
          colorScheme="gray"
          variant="subtle"
        >
          { tag.display_name }
        </Tag>
      )) }
    </Flex>
  );
};

export default React.memo(TxWatchListTags);
