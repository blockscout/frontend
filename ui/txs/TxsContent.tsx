import { Box, Show, Hide } from '@chakra-ui/react';
import React from 'react';

import type { AddressFromToFilter } from 'types/api/address';

import useIsMobile from 'lib/hooks/useIsMobile';
import AddressCsvExportLink from 'ui/address/AddressCsvExportLink';
import DataListDisplay from 'ui/shared/DataListDisplay';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';
import * as SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';

import TxsHeaderMobile from './TxsHeaderMobile';
import TxsListItem from './TxsListItem';
import TxsTable from './TxsTable';
import useTxsSort from './useTxsSort';

type Props = {
  // eslint-disable-next-line max-len
  query: QueryWithPagesResult<'txs_validated' | 'txs_pending'> | QueryWithPagesResult<'txs_watchlist'> | QueryWithPagesResult<'block_txs'> | QueryWithPagesResult<'zkevm_l2_txn_batch_txs'>;
  showBlockInfo?: boolean;
  showSocketInfo?: boolean;
  socketInfoAlert?: string;
  socketInfoNum?: number;
  currentAddress?: string;
  filter?: React.ReactNode;
  filterValue?: AddressFromToFilter;
  enableTimeIncrement?: boolean;
  top?: number;
}

const TxsContent = ({
  filter,
  filterValue,
  query,
  showBlockInfo = true,
  showSocketInfo = true,
  socketInfoAlert,
  socketInfoNum,
  currentAddress,
  enableTimeIncrement,
  top,
}: Props) => {
  const { data, isPlaceholderData, isError, setSortByField, setSortByValue, sorting } = useTxsSort(query);
  const isMobile = useIsMobile();

  const content = data?.items ? (
    <>
      <Show below="lg" ssr={ false }>
        <Box>
          { showSocketInfo && (
            <SocketNewItemsNotice.Mobile
              url={ window.location.href }
              num={ socketInfoNum }
              alert={ socketInfoAlert }
              isLoading={ isPlaceholderData }
            />
          ) }
          { data.items.map((tx, index) => (
            <TxsListItem
              key={ tx.hash + (isPlaceholderData ? index : '') }
              tx={ tx }
              showBlockInfo={ showBlockInfo }
              currentAddress={ currentAddress }
              enableTimeIncrement={ enableTimeIncrement }
              isLoading={ isPlaceholderData }
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
          top={ top || query.pagination.isVisible ? 80 : 0 }
          currentAddress={ currentAddress }
          enableTimeIncrement={ enableTimeIncrement }
          isLoading={ isPlaceholderData }
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
      showPagination={ query.pagination.isVisible }
      filterComponent={ filter }
      linkSlot={ currentAddress ? (
        <AddressCsvExportLink
          address={ currentAddress }
          params={{ type: 'transactions', filterType: 'address', filterValue }}
          isLoading={ query.pagination.isLoading }
        />
      ) : null
      }
    />
  ) : null;

  return (
    <DataListDisplay
      isError={ isError }
      items={ data?.items }
      emptyText="There are no transactions."
      content={ content }
      actionBar={ actionBar }
    />
  );
};

export default TxsContent;
