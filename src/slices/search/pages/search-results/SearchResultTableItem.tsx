// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { SearchResultRowItem } from './table-item/types';
import type { AddressFormat } from 'src/slices/address/types/config';

import { saveToRecentKeywords } from 'src/slices/search/utils/recent-search-keywords';
import { getItemCategory, getSearchCategories } from 'src/slices/search/utils/search-categories';

import * as analytics from 'src/shared/analytics';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';

import SearchResultAddressCells from './table-item/SearchResultAddressCells';
import SearchResultAppCells from './table-item/SearchResultAppCells';
import SearchResultBlobCells from './table-item/SearchResultBlobCells';
import SearchResultBlockCells from './table-item/SearchResultBlockCells';
import SearchResultEnsDomainCells from './table-item/SearchResultEnsDomainCells';
import SearchResultLabelCells from './table-item/SearchResultLabelCells';
import SearchResultTacOperationCells from './table-item/SearchResultTacOperationCells';
import SearchResultTokenCells from './table-item/SearchResultTokenCells';
import SearchResultTxCells from './table-item/SearchResultTxCells';
import SearchResultUserOpCells from './table-item/SearchResultUserOpCells';
import SearchResultZetaChainCCTXCells from './table-item/SearchResultZetaChainCCTXCells';

interface Props {
  data: SearchResultRowItem;
  searchTerm: string;
  isLoading?: boolean;
  addressFormat?: AddressFormat;
}

const SearchResultTableItem = ({ data, searchTerm, isLoading, addressFormat }: Props) => {

  const handleLinkClick = React.useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    saveToRecentKeywords(searchTerm);
    analytics.logEvent(analytics.EventTypes.SEARCH_QUERY, {
      'Search query': searchTerm,
      'Source page type': 'Search results',
      'Result URL': e.currentTarget.href,
    });
  }, [ searchTerm ]);

  const cellsProps = { searchTerm, isLoading, addressFormat, onLinkClick: handleLinkClick };

  const content = (() => {
    switch (data.type) {
      case 'token':
        return <SearchResultTokenCells data={ data } { ...cellsProps }/>;
      case 'metadata_tag':
      case 'contract':
      case 'address':
        return <SearchResultAddressCells data={ data } { ...cellsProps }/>;
      case 'label':
        return <SearchResultLabelCells data={ data } { ...cellsProps }/>;
      case 'app':
        return <SearchResultAppCells data={ data } { ...cellsProps }/>;
      case 'block':
        return <SearchResultBlockCells data={ data } { ...cellsProps }/>;
      case 'transaction':
        return <SearchResultTxCells data={ data } { ...cellsProps }/>;
      case 'zetaChainCCTX':
        return <SearchResultZetaChainCCTXCells data={ data } { ...cellsProps }/>;
      case 'tac_operation':
        return <SearchResultTacOperationCells data={ data } { ...cellsProps }/>;
      case 'blob':
        return <SearchResultBlobCells data={ data } { ...cellsProps }/>;
      case 'user_operation':
        return <SearchResultUserOpCells data={ data } { ...cellsProps }/>;
      case 'ens_domain':
        return <SearchResultEnsDomainCells data={ data } { ...cellsProps }/>;
    }
  })();

  const category = React.useMemo(() => getItemCategory(data), [ data ]);
  const searchCategories = React.useMemo(() => getSearchCategories(), []);

  return (
    <TableRow>
      { content }
      <TableCell fontSize="sm" textTransform="capitalize" verticalAlign="middle">
        <Skeleton loading={ isLoading } color="text.secondary" display="inline-block">
          <span>{ category ? searchCategories.find(({ id }) => id === category)?.itemTitle : '' }</span>
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(SearchResultTableItem);
