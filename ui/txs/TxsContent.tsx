import { Text, Box, Show, Hide } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { TxsResponse } from 'types/api/transaction';

import useIsMobile from 'lib/hooks/useIsMobile';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import type { Props as PaginationProps } from 'ui/shared/Pagination';
import SkeletonList from 'ui/shared/skeletons/SkeletonList';
import SkeletonTable from 'ui/shared/skeletons/SkeletonTable';
import SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';

import TxsHeaderMobile from './TxsHeaderMobile';
import TxsListItem from './TxsListItem';
import TxsTable from './TxsTable';
import useTxsSort from './useTxsSort';

type QueryResult = UseQueryResult<TxsResponse> & {
  pagination: PaginationProps;
  isPaginationVisible: boolean;
};

type Props = {
  query: QueryResult;
  showBlockInfo?: boolean;
  showSocketInfo?: boolean;
  socketInfoAlert?: string;
  socketInfoNum?: number;
  currentAddress?: string;
  filter?: React.ReactNode;
  enableTimeIncrement?: boolean;
}

const TxsContent = ({
  filter,
  query,
  showBlockInfo = true,
  showSocketInfo = true,
  socketInfoAlert,
  socketInfoNum,
  currentAddress,
  enableTimeIncrement,
}: Props) => {
  const { data, isLoading, isError, setSortByField, setSortByValue, sorting } = useTxsSort(query);
  const isMobile = useIsMobile();

  const content = (() => {
    if (isError) {
      return <DataFetchAlert/>;
    }

    if (isLoading) {
      return (
        <>
          <Show below="lg" ssr={ false }><SkeletonList/></Show>
          <Hide below="lg" ssr={ false }>
            <SkeletonTable columns={ showBlockInfo ?
              [ '32px', '22%', '160px', '20%', '18%', '292px', '20%', '20%' ] :
              [ '32px', '22%', '160px', '20%', '292px', '20%', '20%' ]
            }/>
          </Hide>
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
              <SocketNewItemsNotice url={ window.location.href } num={ socketInfoNum } alert={ socketInfoAlert }>
                { ({ content }) => <Box>{ content }</Box> }
              </SocketNewItemsNotice>
            ) }
            { txs.map(tx => (
              <TxsListItem
                tx={ tx }
                key={ tx.hash }
                showBlockInfo={ showBlockInfo }
                currentAddress={ currentAddress }
                enableTimeIncrement={ enableTimeIncrement }
              />
            )) }
          </Box>
        </Show>
        <Hide below="lg" ssr={ false }>
          <TxsTable
            txs={ txs }
            sort={ setSortByField }
            sorting={ sorting }
            showBlockInfo={ showBlockInfo }
            showSocketInfo={ showSocketInfo }
            socketInfoAlert={ socketInfoAlert }
            socketInfoNum={ socketInfoNum }
            top={ query.isPaginationVisible ? 80 : 0 }
            currentAddress={ currentAddress }
            enableTimeIncrement={ enableTimeIncrement }
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
          showPagination={ query.isPaginationVisible }
          filterComponent={ filter }
        />
      ) }
      { content }
    </>
  );
};

export default TxsContent;
