import { Text, Box, Show, Hide } from '@chakra-ui/react';
import React, { useState, useCallback } from 'react';

import type { TTxsFilters } from 'types/api/txsFilters';
import type { QueryKeys } from 'types/client/queries';
import type { Sort } from 'types/client/txs-sort';

import * as cookies from 'lib/cookies';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import TxsHeader from './TxsHeader';
import TxsSkeletonDesktop from './TxsSkeletonDesktop';
import TxsSkeletonMobile from './TxsSkeletonMobile';
import TxsWithSort from './TxsWithSort';

type Props = {
  queryName: QueryKeys.txsPending | QueryKeys.txsValidate | QueryKeys.blockTxs;
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
  const [ sorting, setSorting ] = useState<Sort>(cookies.get(cookies.NAMES.TXS_SORT) as Sort || '');
  // const [ filters, setFilters ] = useState<Partial<TTxsFilters>>({ type: [], method: [] });

  const sort = useCallback((field: 'val' | 'fee') => () => {
    setSorting((prevVal) => {
      let newVal: Sort = '';
      if (field === 'val') {
        if (prevVal === 'val-asc') {
          newVal = '';
        } else if (prevVal === 'val-desc') {
          newVal = 'val-asc';
        } else {
          newVal = 'val-desc';
        }
      }
      if (field === 'fee') {
        if (prevVal === 'fee-asc') {
          newVal = '';
        } else if (prevVal === 'fee-desc') {
          newVal = 'fee-asc';
        } else {
          newVal = 'fee-desc';
        }
      }
      cookies.set(cookies.NAMES.TXS_SORT, newVal);
      return newVal;
    });
  }, [ ]);

  const {
    data,
    isLoading,
    isError,
    pagination,
  } = useQueryWithPages({
    apiPath,
    queryName,
    filters: stateFilter ? { filter: stateFilter } : undefined,
  });
  // } = useQueryWithPages({ ...filters, filter: stateFilter, apiPath });

  const content = (() => {
    if (isError) {
      return <DataFetchAlert/>;
    }

    const txs = data?.items;

    if (!isLoading && !txs?.length) {
      return <Text as="span">There are no transactions.</Text>;
    }

    if (!isLoading && txs) {
      return <TxsWithSort txs={ txs } sorting={ sorting } sort={ sort }/>;
    }

    return (
      <>
        <Show below="lg" ssr={ false }><TxsSkeletonMobile/></Show>
        <Hide below="lg" ssr={ false }><TxsSkeletonDesktop/></Hide>
      </>
    );
  })();

  return (
    <>
      { showDescription && <Box mb={{ base: 6, lg: 12 }}>Only the first 10,000 elements are displayed</Box> }
      <TxsHeader mt={ -6 } sorting={ sorting } setSorting={ setSorting } paginationProps={ pagination }/>
      { content }
    </>
  );
};

export default TxsContent;
