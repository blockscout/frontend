import { Text, Box, Show, Hide } from '@chakra-ui/react';
import React from 'react';

import type { TTxsFilters } from 'types/api/txsFilters';
import type { QueryKeys } from 'types/client/queries';

import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import TxsHeader from './TxsHeader';
import TxsListItem from './TxsListItem';
import TxsSkeletonDesktop from './TxsSkeletonDesktop';
import TxsSkeletonMobile from './TxsSkeletonMobile';
import TxsTable from './TxsTable';
import useTxsSort from './useTxsSort';

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
  const {
    pagination,
    ...queryResult
  } = useQueryWithPages({
    apiPath,
    queryName,
    filters: stateFilter ? { filter: stateFilter } : undefined,
  });
  // } = useQueryWithPages({ ...filters, filter: stateFilter, apiPath });
  const { data, isLoading, isError, setSortByField, setSortByValue, sorting } = useTxsSort(queryResult);

  const content = (() => {
    if (isError) {
      return <DataFetchAlert/>;
    }

    if (isLoading) {
      return (
        <>
          <Show below="lg" ssr={ false }><TxsSkeletonMobile/></Show>
          <Hide below="lg" ssr={ false }><TxsSkeletonDesktop/></Hide>
        </>
      );
    }

    const txs = data.items;

    if (!txs.length) {
      return <Text as="span">There are no transactions.</Text>;
    }

    return (
      <>
        <Show below="lg" ssr={ false }><Box>{ txs.map(tx => <TxsListItem tx={ tx } key={ tx.hash }/>) }</Box></Show>
        <Hide below="lg" ssr={ false }><TxsTable txs={ txs } sort={ setSortByField } sorting={ sorting }/></Hide>
      </>
    );
  })();

  return (
    <>
      { showDescription && <Box mb={{ base: 6, lg: 12 }}>Only the first 10,000 elements are displayed</Box> }
      <TxsHeader mt={ -6 } sorting={ sorting } setSorting={ setSortByValue } paginationProps={ pagination }/>
      { content }
    </>
  );
};

export default TxsContent;
