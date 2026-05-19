// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra, Flex } from '@chakra-ui/react';
import React from 'react';

import type { SearchResultBlob } from 'client/features/data-availability/types/api';
import type { ItemsProps } from 'client/slices/search/components/search-bar/SearchBarSuggest/types';

import * as BlobEntity from 'client/features/data-availability/components/entity/BlobEntity';

import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

const SearchBarSuggestBlob = ({ data }: ItemsProps<SearchResultBlob>) => {
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
