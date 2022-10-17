import { Alert, Box, HStack, Show, Button } from '@chakra-ui/react';
import React, { useState } from 'react';

import type { Sort } from 'types/client/txs-sort';

import useIsMobile from 'lib/hooks/useIsMobile';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import FilterButton from 'ui/shared/FilterButton';
import FilterInput from 'ui/shared/FilterInput';
import Pagination from 'ui/shared/Pagination';
import SortButton from 'ui/shared/SortButton';

import TxsSkeletonDesktop from './TxsSkeletonDesktop';
import TxsSkeletonMobile from './TxsSkeletonMobile';
import TxsWithSort from './TxsWithSort';
import useQueryWithPages from './useQueryWithPages';

type Props = {
  queryName: string;
  showDescription?: boolean;
  stateFilter: 'validated' | 'pending';
}

const TxsContent = ({
  showDescription,
  queryName,
  stateFilter,
}: Props) => {
  const [ sorting, setSorting ] = useState<Sort>();

  const {
    data,
    isLoading,
    isError,
    page,
    onPrevPageClick,
    onNextPageClick,
    hasPagination,
    resetPage,
  } = useQueryWithPages(queryName, stateFilter);

  const isMobile = useIsMobile(false);

  if (isError) {
    return <DataFetchAlert/>;
  }

  const txs = data?.items;

  if (!isLoading && !txs) {
    return <Alert>There are no transactions.</Alert>;
  }

  let content = (
    <>
      <Show below="lg" ssr={ false }><TxsSkeletonMobile/></Show>
      <Show above="lg" ssr={ false }><TxsSkeletonDesktop/></Show>
    </>
  );

  if (!isLoading && txs) {
    content = <TxsWithSort txs={ txs } sorting={ sorting } setSorting={ setSorting }/>;
  }

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
        { isMobile && (
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
      { content }
      <Box mx={{ base: 0, lg: 6 }} my={{ base: 6, lg: 3 }}>
        { hasPagination ?
          <Pagination currentPage={ page } onNextPageClick={ onNextPageClick } onPrevPageClick={ onPrevPageClick }/> :
          <Button onClick={ resetPage }>Reset</Button>
        }
      </Box>
    </>
  );
};

export default TxsContent;
