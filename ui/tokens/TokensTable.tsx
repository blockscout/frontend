import React from 'react';

import type { TokenInfo } from 'types/api/token';
import type { TokensSortingField, TokensSortingValue } from 'types/api/tokens';

import { TableBody, TableColumnHeader, TableColumnHeaderSortable, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import { default as getNextSortValueShared } from 'ui/shared/sort/getNextSortValue';

import TokensTableItem from './TokensTableItem';

const SORT_SEQUENCE: Record<TokensSortingField, Array<TokensSortingValue>> = {
  fiat_value: [ 'fiat_value-desc', 'fiat_value-asc', 'default' ],
  holders_count: [ 'holders_count-desc', 'holders_count-asc', 'default' ],
  circulating_market_cap: [ 'circulating_market_cap-desc', 'circulating_market_cap-asc', 'default' ],
};

const getNextSortValue = (getNextSortValueShared<TokensSortingField, TokensSortingValue>).bind(undefined, SORT_SEQUENCE);

type Props = {
  items: Array<TokenInfo>;
  page: number;
  sorting: TokensSortingValue;
  setSorting: (value: TokensSortingValue) => void;
  isLoading?: boolean;
  top?: number;
};

const TokensTable = ({ items, page, isLoading, sorting, setSorting, top }: Props) => {

  const sort = React.useCallback((field: TokensSortingField) => {
    const value = getNextSortValue(field)(sorting);
    setSorting(value);
  }, [ sorting, setSorting ]);

  return (
    <TableRoot>
      <TableHeaderSticky top={ top ?? ACTION_BAR_HEIGHT_DESKTOP }>
        <TableRow>
          <TableColumnHeader w="50%">Token</TableColumnHeader>
          <TableColumnHeaderSortable
            isNumeric
            w="15%"
            sortField="fiat_value"
            sortValue={ sorting }
            onSortToggle={ sort }
          >
            Price
          </TableColumnHeaderSortable>
          <TableColumnHeaderSortable
            isNumeric
            w="20%"
            sortField="circulating_market_cap"
            sortValue={ sorting }
            onSortToggle={ sort }
          >
            On-chain market cap
          </TableColumnHeaderSortable>
          <TableColumnHeaderSortable
            isNumeric
            w="15%"
            sortField="holders_count"
            sortValue={ sorting }
            onSortToggle={ sort }
          >
            Holders
          </TableColumnHeaderSortable>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => (
          <TokensTableItem key={ item.address_hash + (isLoading ? index : '') } token={ item } index={ index } page={ page } isLoading={ isLoading }/>
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default TokensTable;
