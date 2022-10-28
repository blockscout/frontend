import { Alert, Box, HStack, Show, Button } from '@chakra-ui/react';
import React, { useState, useCallback } from 'react';

import type { TTxsFilters } from 'types/api/txsFilters';
import type { QueryKeys } from 'types/client/queries';
import type { Sort } from 'types/client/txs-sort';

import useIsMobile from 'lib/hooks/useIsMobile';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
// import FilterInput from 'ui/shared/FilterInput';
import Pagination from 'ui/shared/Pagination';
import SortButton from 'ui/shared/SortButton';

// import TxsFilters from './TxsFilters';
import TxsSkeletonDesktop from './TxsSkeletonDesktop';
import TxsSkeletonMobile from './TxsSkeletonMobile';
import TxsWithSort from './TxsWithSort';
import useQueryWithPages from './useQueryWithPages';

type Props = {
  queryName: QueryKeys;
  showDescription?: boolean;
  stateFilter?: TTxsFilters['filter'];
  apiPath: string;
}

const TxsContent = ({
  queryName,
  showDescription,
  stateFilter,
  apiPath,
}: Props) => {
  const [ sorting, setSorting ] = useState<Sort>();
  // const [ filters, setFilters ] = useState<Partial<TTxsFilters>>({ type: [], method: [] });

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
  }, [ setSorting ]);

  const {
    data,
    isLoading,
    isError,
    page,
    onPrevPageClick,
    onNextPageClick,
    hasPagination,
    resetPage,
  } = useQueryWithPages(apiPath, queryName, stateFilter && { filter: stateFilter });
  // } = useQueryWithPages({ ...filters, filter: stateFilter, apiPath });

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
    content = <TxsWithSort txs={ txs } sorting={ sorting } sort={ sort }/>;
  }

  return (
    <>
      { showDescription && <Box mb={ 12 }>Only the first 10,000 elements are displayed</Box> }
      <HStack mb={ 6 }>
        { /* api is not implemented */ }
        { /* <TxsFilters
          filters={ filters }
          onFiltersChange={ setFilters }
          appliedFiltersNum={ 0 }
        /> */ }
        { isMobile && (
          <SortButton
            // eslint-disable-next-line react/jsx-no-bind
            handleSort={ () => {} }
            isSortActive={ Boolean(sorting) }
            display={{ base: 'block', lg: 'none' }}
          />
        ) }
        { /* api is not implemented */ }
        { /* <FilterInput
          // eslint-disable-next-line react/jsx-no-bind
          onChange={ () => {} }
          maxW="360px"
          size="xs"
          placeholder="Search by addresses, hash, method..."
        /> */ }
      </HStack>
      { content }
      <Box mx={{ base: 0, lg: 6 }} my={{ base: 6, lg: 3 }}>
        { hasPagination ? (
          <Pagination
            currentPage={ page }
            hasNextPage={ data?.next_page_params !== undefined && Object.keys(data?.next_page_params || {}).length > 0 }
            onNextPageClick={ onNextPageClick }
            onPrevPageClick={ onPrevPageClick }
          />
        ) :
          // temporary button, waiting for new pagination mockups
          <Button onClick={ resetPage }>Reset</Button>
        }
      </Box>
    </>
  );
};

export default TxsContent;
