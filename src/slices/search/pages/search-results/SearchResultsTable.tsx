// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { AddressFormat } from 'src/slices/address/types/config';
import type { SearchResultItem } from 'src/slices/search/types/client';

import type { SearchResultAppItem } from 'src/slices/search/utils/search-categories';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import SearchResultTableItem from './SearchResultTableItem';

interface Props {
  items: Array<SearchResultItem | SearchResultAppItem>;
  searchTerm: string;
  isLoading?: boolean;
  addressFormat?: AddressFormat;
  top?: number;
  resetKey?: string;
}

const SearchResultsTable = ({ items, searchTerm, isLoading, addressFormat, top, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });

  return (
    <TableRoot fontWeight={ 500 }>
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader width="30%">Search result</TableColumnHeader>
          <TableColumnHeader width="35%"/>
          <TableColumnHeader width="35%" pr={ 10 }/>
          <TableColumnHeader width="150px">Category</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.slice(0, renderedItemsNum).map((item, index) => (
          <SearchResultTableItem
            key={ (isLoading ? 'placeholder_' : 'actual_') + index }
            data={ item }
            searchTerm={ searchTerm }
            isLoading={ isLoading }
            addressFormat={ addressFormat }
          />
        )) }
        <TableRow ref={ cutRef }/>
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(SearchResultsTable);
