import { Text, Box, Show, Hide } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { TxsResponse } from 'types/api/transaction';

import useIsMobile from 'lib/hooks/useIsMobile';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import type { Props as PaginationProps } from 'ui/shared/Pagination';

import TxsHeaderMobile from './TxsHeaderMobile';
import TxsListItem from './TxsListItem';
import TxsNewItemNotice from './TxsNewItemNotice';
import TxsSkeletonDesktop from './TxsSkeletonDesktop';
import TxsSkeletonMobile from './TxsSkeletonMobile';
import TxsTable from './TxsTable';
import useTxsSort from './useTxsSort';

type QueryResult = UseQueryResult<TxsResponse> & {
  pagination: PaginationProps;
};

type Props = {
  query: QueryResult;
  showBlockInfo?: boolean;
  showSocketInfo?: boolean;
}

const TxsContent = ({ query, showBlockInfo = true, showSocketInfo = true }: Props) => {
  const { data, isLoading, isError, setSortByField, setSortByValue, sorting } = useTxsSort(query);
  const isPaginatorHidden = !isLoading && !isError && query.pagination.page === 1 && !query.pagination.hasNextPage;
  const isMobile = useIsMobile();

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
            { showSocketInfo && (
              <TxsNewItemNotice url={ window.location.href }>
                { ({ content }) => <Box>{ content }</Box> }
              </TxsNewItemNotice>
            ) }
            { txs.map(tx => <TxsListItem tx={ tx } key={ tx.hash } showBlockInfo={ showBlockInfo }/>) }
          </Box>
        </Show>
        <Hide below="lg" ssr={ false }>
          <TxsTable
            txs={ txs }
            sort={ setSortByField }
            sorting={ sorting }
            showBlockInfo={ showBlockInfo }
            showSocketInfo={ showSocketInfo }
            top={ isPaginatorHidden ? 0 : 80 }
          />
        </Hide>
      </>
    );
  })();

  return (
    <>
      { isMobile && (
        <TxsHeaderMobile
          mt={ -6 }
          sorting={ sorting }
          setSorting={ setSortByValue }
          paginationProps={ query.pagination }
          showPagination={ !isPaginatorHidden }
        />
      ) }
      { content }
    </>
  );
};

export default TxsContent;
