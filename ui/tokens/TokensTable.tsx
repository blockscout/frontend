import React from 'react';

import type { TokenInfo } from 'types/api/token';
import type { TokensSortingField, TokensSortingValue } from 'types/api/tokens';

import { Link } from 'toolkit/chakra/link';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import IconSvg from 'ui/shared/IconSvg';
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
  const sortIconTransform = sorting?.includes('asc') ? 'rotate(-90deg)' : 'rotate(90deg)';

  const sort = React.useCallback((field: TokensSortingField) => () => {
    const value = getNextSortValue(field)(sorting);
    setSorting(value);
  }, [ sorting, setSorting ]);

  return (
    <TableRoot>
      <TableHeaderSticky top={ top ?? ACTION_BAR_HEIGHT_DESKTOP }>
        <TableRow>
          <TableColumnHeader w="50%">Token</TableColumnHeader>
          <TableColumnHeader isNumeric w="15%">
            <Link onClick={ sort('fiat_value') } display="flex" justifyContent="end">
              { sorting?.includes('fiat_value') && <IconSvg name="arrows/east-mini" boxSize={ 4 } transform={ sortIconTransform }/> }
              Price
            </Link>
          </TableColumnHeader>
          <TableColumnHeader isNumeric w="20%">
            <Link onClick={ sort('circulating_market_cap') } display="flex" justifyContent="end">
              { sorting?.includes('circulating_market_cap') && <IconSvg name="arrows/east-mini" boxSize={ 4 } transform={ sortIconTransform }/> }
              On-chain market cap
            </Link>
          </TableColumnHeader>
          <TableColumnHeader isNumeric w="15%">
            <Link onClick={ sort('holders_count') } display="flex" justifyContent="end">
              { sorting?.includes('holders_count') && <IconSvg name="arrows/east-mini" boxSize={ 4 } transform={ sortIconTransform }/> }
              Holders
            </Link>
          </TableColumnHeader>
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
