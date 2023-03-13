import { Box, Show, Hide } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { TxsResponse } from 'types/api/transaction';

import useIsMobile from 'lib/hooks/useIsMobile';
import AddressCsvExportLink from 'ui/address/AddressCsvExportLink';
import DataListDisplay from 'ui/shared/DataListDisplay';
import type { Props as PaginationProps } from 'ui/shared/Pagination';
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
  top?: number;
  hasLongSkeleton?: boolean;
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
  hasLongSkeleton,
  top,
}: Props) => {
  const { data, isLoading, isError, setSortByField, setSortByValue, sorting } = useTxsSort(query);
  const isMobile = useIsMobile();

  const content = data?.items ? (
    <>
      <Show below="lg" ssr={ false }>
        <Box>
          { showSocketInfo && (
            <SocketNewItemsNotice
              url={ window.location.href }
              num={ socketInfoNum }
              alert={ socketInfoAlert }
              borderBottomRadius={ 0 }
            >
              { ({ content }) => <Box>{ content }</Box> }
            </SocketNewItemsNotice>
          ) }
          { data.items.map(tx => (
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
          txs={ data.items }
          sort={ setSortByField }
          sorting={ sorting }
          showBlockInfo={ showBlockInfo }
          showSocketInfo={ showSocketInfo }
          socketInfoAlert={ socketInfoAlert }
          socketInfoNum={ socketInfoNum }
          top={ top || query.isPaginationVisible ? 80 : 0 }
          currentAddress={ currentAddress }
          enableTimeIncrement={ enableTimeIncrement }
        />
      </Hide>
    </>
  ) : null;

  const actionBar = isMobile ? (
    <TxsHeaderMobile
      mt={ -6 }
      sorting={ sorting }
      setSorting={ setSortByValue }
      paginationProps={ query.pagination }
      showPagination={ query.isPaginationVisible }
      filterComponent={ filter }
      linkSlot={ currentAddress ? <AddressCsvExportLink address={ currentAddress } type="transactions" ml={ 2 }/> : null }
    />
  ) : null;

  return (
    <DataListDisplay
      isError={ isError }
      isLoading={ isLoading }
      items={ data?.items }
      isLongSkeleton={ hasLongSkeleton }
      skeletonDesktopColumns={ showBlockInfo ?
        [ '32px', '22%', '160px', '20%', '18%', '292px', '20%', '20%' ] :
        [ '32px', '22%', '160px', '20%', '292px', '20%', '20%' ]
      }
      emptyText="There are no transactions."
      content={ content }
      actionBar={ actionBar }
    />
  );
};

export default TxsContent;
