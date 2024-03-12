import { chakra, Flex } from '@chakra-ui/react';
import React from 'react';

import type { SearchResultBlob } from 'types/api/search';

import * as BlobEntity from 'ui/shared/entities/blob/BlobEntity';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

interface Props {
  data: SearchResultBlob;
  searchTerm: string;
}

const SearchBarSuggestBlob = ({ data }: Props) => {
  return (
    <Flex alignItems="center" minW={ 0 }>
      <BlobEntity.Icon/>
      <chakra.mark overflow="hidden" whiteSpace="nowrap" fontWeight={ 700 }>
        <HashStringShortenDynamic hash={ data.blob_hash } isTooltipDisabled/>
      </chakra.mark>
    </Flex>
  );
};

export default React.memo(SearchBarSuggestBlob);
