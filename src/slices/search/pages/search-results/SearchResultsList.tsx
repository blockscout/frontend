// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { AddressFormat } from 'src/slices/address/types/config';
import type { SearchResultItem } from 'src/slices/search/types/client';

import type { SearchResultAppItem } from 'src/slices/search/utils/search-categories';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import SearchResultListItem from './SearchResultListItem';

interface Props {
  items: Array<SearchResultItem | SearchResultAppItem>;
  searchTerm: string;
  isLoading?: boolean;
  addressFormat?: AddressFormat;
  resetKey?: string;
}

const SearchResultsList = ({ items, searchTerm, isLoading, addressFormat, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });

  return (
    <>
      <Box>
        { items.slice(0, renderedItemsNum).map((item, index) => (
          <SearchResultListItem
            key={ (isLoading ? 'placeholder_' : 'actual_') + index }
            data={ item }
            searchTerm={ searchTerm }
            isLoading={ isLoading }
            addressFormat={ addressFormat }
          />
        )) }
      </Box>
      <Box ref={ cutRef } h={ 0 }/>
    </>
  );
};

export default React.memo(SearchResultsList);
