// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type { AggregatedTokenInfo } from 'src/features/multichain/types/client';
import type { TokensSortingField, TokensSortingValue } from 'src/slices/token/types/api';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';
import { default as getNextSortValueShared } from 'src/shared/sort/get-next-sort-value';

import type { OnValueChangeHandler } from 'src/toolkit/chakra/select';
import { TableBody, TableColumnHeader, TableColumnHeaderSortable, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import TokensTableItem from './TokensTableItem';

const SORT_SEQUENCE: Record<TokensSortingField, Array<TokensSortingValue>> = {
  fiat_value: [ 'fiat_value-desc', 'fiat_value-asc', 'default' ],
  holders_count: [ 'holders_count-desc', 'holders_count-asc', 'default' ],
  circulating_market_cap: [ 'circulating_market_cap-desc', 'circulating_market_cap-asc', 'default' ],
};

const getNextSortValue = (getNextSortValueShared<TokensSortingField, TokensSortingValue>).bind(undefined, SORT_SEQUENCE);

type Props = {
  items: Array<schemas['Token']> | Array<AggregatedTokenInfo>;
  page: number;
  sorting?: TokensSortingValue;
  setSorting?: OnValueChangeHandler;
  isLoading?: boolean;
  top?: number;
  resetKey?: string;
};

const TokensTable = ({ items, page, isLoading, sorting, setSorting, top, resetKey }: Props) => {

  const hasSorting = setSorting && sorting;
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });

  const sort = React.useCallback((field: TokensSortingField) => {
    if (!hasSorting) {
      return;
    }
    const value = getNextSortValue(field)(sorting);
    setSorting({ value: [ value ] });
  }, [ sorting, setSorting, hasSorting ]);

  return (
    <TableRoot>
      <TableHeaderSticky top={ top ?? ACTION_BAR_HEIGHT_DESKTOP }>
        <TableRow>
          <TableColumnHeader w="50%">Token</TableColumnHeader>
          { hasSorting ? (
            <TableColumnHeaderSortable
              isNumeric
              w="15%"
              sortField="fiat_value"
              sortValue={ sorting }
              onSortToggle={ sort }
            >
              Price
            </TableColumnHeaderSortable>
          ) : (
            <TableColumnHeader isNumeric width="15%">
              Price
            </TableColumnHeader>
          ) }
          { hasSorting ? (
            <TableColumnHeaderSortable
              isNumeric
              w="20%"
              sortField="circulating_market_cap"
              sortValue={ sorting }
              onSortToggle={ sort }
            >
              On-chain market cap
            </TableColumnHeaderSortable>
          ) : (
            <TableColumnHeader isNumeric width="20%">
              On-chain market cap
            </TableColumnHeader>
          ) }
          { hasSorting ? (
            <TableColumnHeaderSortable
              isNumeric
              w="15%"
              sortField="holders_count"
              sortValue={ sorting }
              onSortToggle={ sort }
            >
              Holders
            </TableColumnHeaderSortable>
          ) : (
            <TableColumnHeader isNumeric width="15%">
              Holders
            </TableColumnHeader>
          ) }
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.slice(0, renderedItemsNum).map((item, index) => {
          const chainIds = 'chain_infos' in item ? Object.keys(item.chain_infos).join(',') : undefined;

          return (
            <TokensTableItem
              key={ item.address_hash + (isLoading ? index : '') + (chainIds ? chainIds : '') }
              token={ item }
              index={ index }
              page={ page }
              isLoading={ isLoading }
            />
          );
        }) }
        <TableRow ref={ cutRef }/>
      </TableBody>
    </TableRoot>
  );
};

export default TokensTable;
