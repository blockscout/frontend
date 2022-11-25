import { Text, Box, Show, Hide } from '@chakra-ui/react';
import React from 'react';

import type { TTxsFilters } from 'types/api/txsFilters';
import type { QueryKeys } from 'types/client/queries';

import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import TxsHeader from './TxsHeader';
import TxsListItem from './TxsListItem';
import TxsNewItemNotice from './TxsNewItemNotice';
import TxsSkeletonDesktop from './TxsSkeletonDesktop';
import TxsSkeletonMobile from './TxsSkeletonMobile';
import TxsTable from './TxsTable';
import useTxsSort from './useTxsSort';

type Props = {
  queryName: QueryKeys.txsPending | QueryKeys.txsValidate | QueryKeys.blockTxs;
  stateFilter?: TTxsFilters['filter'];
  apiPath: string;
  showBlockInfo?: boolean;
}

const TxsContent = ({
  queryName,
  stateFilter,
  apiPath,
  showBlockInfo = true,
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
  const isPaginatorHidden = !isLoading && !isError && pagination.page === 1 && !pagination.hasNextPage;

  const content = (() => {
    if (isError) {
      return <DataFetchAlert/>;
    }

    if (isLoading) {
      return (
        <>
          <Show below="lg" ssr={ false }><TxsSkeletonMobile showBlockInfo={ showBlockInfo }/></Show>
          <Hide below="lg" ssr={ false }><TxsSkeletonDesktop showBlockInfo={ showBlockInfo }/></Hide>
        </>
      );
    }

    const txs = data.items;

    if (!txs.length) {
      return <Text as="span">There are no transactions.</Text>;
    }

    return (
      <>
        <Show below="lg" ssr={ false }>
          <Box>
            <TxsNewItemNotice>
              { ({ content }) => <Box>{ content }</Box> }
            </TxsNewItemNotice>
            { txs.map(tx => <TxsListItem tx={ tx } key={ tx.hash } showBlockInfo={ showBlockInfo }/>) }
          </Box>
        </Show>
        <Hide below="lg" ssr={ false }>
          <TxsTable txs={ txs } sort={ setSortByField } sorting={ sorting } showBlockInfo={ showBlockInfo } top={ isPaginatorHidden ? 0 : 80 }/>
        </Hide>
      </>
    );
  })();

  return (
    <>
      <TxsHeader mt={ -6 } sorting={ sorting } setSorting={ setSortByValue } paginationProps={ pagination } showPagination={ !isPaginatorHidden }/>
      { content }
    </>
  );
};

export default TxsContent;
