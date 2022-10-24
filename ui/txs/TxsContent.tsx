import { Alert, Box, Show } from '@chakra-ui/react';
import React, { useState, useCallback } from 'react';

import type { TTxsFilters } from 'types/api/txsFilters';
import type { Sort } from 'types/client/txs-sort';

import DataFetchAlert from 'ui/shared/DataFetchAlert';

import TxsHeader from './TxsHeader';
import TxsSkeletonDesktop from './TxsSkeletonDesktop';
import TxsSkeletonMobile from './TxsSkeletonMobile';
import TxsWithSort from './TxsWithSort';
import useQueryWithPages from './useQueryWithPages';

type Props = {
  showDescription?: boolean;
  stateFilter: TTxsFilters['filter'];
}

const TxsContent = ({
  showDescription,
  stateFilter,
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
    pagination,
  } = useQueryWithPages({ filter: stateFilter });
  // } = useQueryWithPages({ ...filters, filter: stateFilter });

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

  const paginationProps = {
    ...pagination,
    hasNextPage: data?.next_page_params !== undefined && Object.keys(data?.next_page_params).length > 0,
  };

  return (
    <>
      { showDescription && <Box mb={ 12 }>Only the first 10,000 elements are displayed</Box> }
      <TxsHeader sorting={ sorting } paginationProps={ paginationProps }/>
      { content }
    </>
  );
};

export default TxsContent;
