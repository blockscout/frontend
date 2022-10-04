import { Box, HStack, Show } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';

import type { Sort } from 'types/client/txs-sort';

import { txs } from 'data/txs';
import FilterButton from 'ui/shared/FilterButton';
import FilterInput from 'ui/shared/FilterInput';
import Pagination from 'ui/shared/Pagination';
import SortButton from 'ui/shared/SortButton';

import TxsListItem from './TxsListItem';
import TxsTable from './TxsTable';

type Props = {
  showDescription?: boolean;
  showSortButton?: boolean;
}

const TxsContent = ({ showSortButton = true, showDescription = true }: Props) => {
  const [ sorting, setSorting ] = useState<Sort>();
  const [ sortedTxs, setSortedTxs ] = useState(txs);

  // sorting should be preserved with pagination!
  const sort = useCallback((field: 'val' | 'fee') => () => {
    if (field === 'val') {
      setSorting((prevVal => {
        if (prevVal === 'val-asc') {
          return undefined;
        }
        if (prevVal === 'val-desc') {
          return 'val-asc';
        }
        return 'val-desc';
      }));
    }
    if (field === 'fee') {
      setSorting((prevVal => {
        if (prevVal === 'fee-asc') {
          return undefined;
        }
        if (prevVal === 'fee-desc') {
          return 'fee-asc';
        }
        return 'fee-desc';
      }));
    }
  }, []);

  useEffect(() => {
    switch (sorting) {
      case 'val-desc':
        setSortedTxs([ ...txs ].sort((tx1, tx2) => tx1.amount.value - tx2.amount.value));
        break;
      case 'val-asc':
        setSortedTxs([ ...txs ].sort((tx1, tx2) => tx2.amount.value - tx1.amount.value));
        break;
      case 'fee-desc':
        setSortedTxs([ ...txs ].sort((tx1, tx2) => tx1.fee.value - tx2.fee.value));
        break;
      case 'fee-asc':
        setSortedTxs([ ...txs ].sort((tx1, tx2) => tx2.fee.value - tx1.fee.value));
        break;
      default:
        setSortedTxs(txs);
    }
  }, [ sorting ]);

  return (
    <>
      { showDescription && <Box mb={ 12 }>Only the first 10,000 elements are displayed</Box> }
      <HStack mb={ 6 }>
        { /* TODO */ }
        <FilterButton
          isActive={ false }
          // eslint-disable-next-line react/jsx-no-bind
          onClick={ () => {} }
          appliedFiltersNum={ 0 }
        />
        { showSortButton && (
          <SortButton
            // eslint-disable-next-line react/jsx-no-bind
            handleSort={ () => {} }
            isSortActive={ Boolean(sorting) }
            display={{ base: 'block', lg: 'none' }}
          />
        ) }
        <FilterInput
          // eslint-disable-next-line react/jsx-no-bind
          onChange={ () => {} }
          maxW="360px"
          size="xs"
          placeholder="Search by addresses, hash, method..."
        />
      </HStack>
      <Show below="lg">{ sortedTxs.map(tx => <TxsListItem tx={ tx } key={ tx.hash }/>) }</Show>
      <Show above="lg"><TxsTable txs={ sortedTxs } sort={ sort } sorting={ sorting }/></Show>
      <Box mx={{ base: 0, lg: 6 }} my={{ base: 6, lg: 3 }}>
        <Pagination currentPage={ 1 }/>
      </Box>
    </>
  );
};

export default TxsContent;
