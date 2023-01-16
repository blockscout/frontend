import _groupBy from 'lodash/groupBy';
import type { ChangeEvent } from 'react';
import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';

import type { Sort } from '../utils/tokenUtils';
import { calculateUsdValue, filterTokens } from '../utils/tokenUtils';

export default function useData(data: Array<AddressTokenBalance>) {
  const [ searchTerm, setSearchTerm ] = React.useState('');
  const [ erc1155sort, setErc1155Sort ] = React.useState<Sort>('desc');
  const [ erc20sort, setErc20Sort ] = React.useState<Sort>('desc');

  const onInputChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  const onSortClick = React.useCallback((event: React.SyntheticEvent) => {
    const tokenType = (event.currentTarget as HTMLAnchorElement).getAttribute('data-type');
    if (tokenType === 'ERC-1155') {
      setErc1155Sort((prevValue) => prevValue === 'desc' ? 'asc' : 'desc');
    }
    if (tokenType === 'ERC-20') {
      setErc20Sort((prevValue) => prevValue === 'desc' ? 'asc' : 'desc');
    }
  }, []);

  const modifiedData = React.useMemo(() => {
    return data.filter(filterTokens(searchTerm.toLowerCase())).map(calculateUsdValue);
  }, [ data, searchTerm ]);
  const groupedData = React.useMemo(() => {
    return _groupBy(modifiedData, 'token.type');
  }, [ modifiedData ]);

  return {
    searchTerm,
    erc20sort,
    erc1155sort,
    onInputChange,
    onSortClick,
    modifiedData,
    groupedData,
  };
}
