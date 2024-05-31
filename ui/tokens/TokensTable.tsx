import { Link, Table, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfo } from 'types/api/token';
import type { TokensSortingField, TokensSortingValue } from 'types/api/tokens';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import IconSvg from 'ui/shared/IconSvg';
import { default as getNextSortValueShared } from 'ui/shared/sort/getNextSortValue';
import { default as Thead } from 'ui/shared/TheadSticky';

import TokensTableItem from './TokensTableItem';

const SORT_SEQUENCE: Record<TokensSortingField, Array<TokensSortingValue | undefined>> = {
  fiat_value: [ 'fiat_value-desc', 'fiat_value-asc', undefined ],
  holder_count: [ 'holder_count-desc', 'holder_count-asc', undefined ],
  circulating_market_cap: [ 'circulating_market_cap-desc', 'circulating_market_cap-asc', undefined ],
};

const getNextSortValue = (getNextSortValueShared<TokensSortingField, TokensSortingValue>).bind(undefined, SORT_SEQUENCE);

type Props = {
  items: Array<TokenInfo>;
  page: number;
  sorting?: TokensSortingValue;
  setSorting: (val?: TokensSortingValue) => void;
  isLoading?: boolean;
  top?: number;
}

const TokensTable = ({ items, page, isLoading, sorting, setSorting, top }: Props) => {
  const sortIconTransform = sorting?.includes('asc') ? 'rotate(-90deg)' : 'rotate(90deg)';

  const sort = React.useCallback((field: TokensSortingField) => () => {
    const value = getNextSortValue(field)(sorting);
    setSorting(value);
  }, [ sorting, setSorting ]);

  return (
    <Table>
      <Thead top={ top ?? ACTION_BAR_HEIGHT_DESKTOP }>
        <Tr>
          <Th w="50%">Token</Th>
          <Th isNumeric w="15%">
            <Link onClick={ sort('fiat_value') } display="flex" justifyContent="end">
              { sorting?.includes('fiat_value') && <IconSvg name="arrows/east-mini" boxSize={ 4 } transform={ sortIconTransform }/> }
              Price
            </Link>
          </Th>
          <Th isNumeric w="20%">
            <Link onClick={ sort('circulating_market_cap') } display="flex" justifyContent="end">
              { sorting?.includes('circulating_market_cap') && <IconSvg name="arrows/east-mini" boxSize={ 4 } transform={ sortIconTransform }/> }
              On-chain market cap
            </Link>
          </Th>
          <Th isNumeric w="15%">
            <Link onClick={ sort('holder_count') } display="flex" justifyContent="end">
              { sorting?.includes('holder_count') && <IconSvg name="arrows/east-mini" boxSize={ 4 } transform={ sortIconTransform }/> }
              Holders
            </Link>
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        { items.map((item, index) => (
          <TokensTableItem key={ item.address + (isLoading ? index : '') } token={ item } index={ index } page={ page } isLoading={ isLoading }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default TokensTable;
