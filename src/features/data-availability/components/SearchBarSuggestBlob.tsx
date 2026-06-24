// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra, Flex } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type { ItemsProps } from 'src/slices/search/components/search-bar/SearchBarSuggest/types';

import * as BlobEntity from 'src/features/data-availability/components/entity/BlobEntity';

import HashStringShortenDynamic from 'src/shared/texts/HashStringShortenDynamic';

const SearchBarSuggestBlob = ({ data }: ItemsProps<schemas['SearchResultBlob']>) => {
  return (
    <Flex alignItems="center" minW={ 0 }>
      <BlobEntity.Icon/>
      <chakra.mark overflow="hidden" whiteSpace="nowrap" fontWeight={ 700 }>
        <HashStringShortenDynamic hash={ data.blob_hash } noTooltip/>
      </chakra.mark>
    </Flex>
  );
};

export default React.memo(SearchBarSuggestBlob);
