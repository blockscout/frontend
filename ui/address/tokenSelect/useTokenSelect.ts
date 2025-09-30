import { mapValues } from 'es-toolkit';
import React from 'react';

import type { FormattedData } from './types';

import type { Sort } from '../utils/tokenUtils';
import { filterTokens } from '../utils/tokenUtils';

export default function useTokenSelect(data: FormattedData) {
  const [ searchTerm, setSearchTerm ] = React.useState('');
  const [ erc1155sort, setErc1155Sort ] = React.useState<Sort>('desc');
  const [ erc404sort, setErc404Sort ] = React.useState<Sort>('desc');
  const [ erc20sort, setErc20Sort ] = React.useState<Sort>('desc');

  const onInputChange = React.useCallback((searchTerm: string) => {
    setSearchTerm(searchTerm);
  }, []);

  const onSortClick = React.useCallback((event: React.SyntheticEvent) => {
    const tokenType = (event.currentTarget as HTMLAnchorElement).getAttribute('data-type');
    if (tokenType === 'ERC-1155') {
      setErc1155Sort((prevValue) => prevValue === 'desc' ? 'asc' : 'desc');
    }
    if (tokenType === 'ERC-404') {
      setErc404Sort((prevValue) => prevValue === 'desc' ? 'asc' : 'desc');
    }
    if (tokenType === 'ERC-20') {
      setErc20Sort((prevValue) => prevValue === 'desc' ? 'asc' : 'desc');
    }
  }, []);

  const filteredData = React.useMemo(() => {
    return mapValues(data, ({ items, isOverflow }) => ({
      isOverflow,
      items: items.filter(filterTokens(searchTerm.toLowerCase())),
    }));
  }, [ data, searchTerm ]);

  return {
    searchTerm,
    erc20sort,
    erc1155sort,
    erc404sort,
    onInputChange,
    onSortClick,
    data,
    filteredData,
  };
}
