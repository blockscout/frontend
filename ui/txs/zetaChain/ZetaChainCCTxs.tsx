import { Box } from '@chakra-ui/react';
import React from 'react';

import type { TxsSocketType } from './socket/types';
import type { AddressFromToFilter } from 'types/api/address';
import type { Transaction, TransactionsSortingField, TransactionsSortingValue } from 'types/api/transaction';
import type { PaginationParams } from 'ui/shared/pagination/types';

import useIsMobile from 'lib/hooks/useIsMobile';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import getNextSortValue from 'ui/shared/sort/getNextSortValue';

import ZetaChainCCTxsTable from './ZetaChainCCTxsTable';
import { ZetaChainCCTX } from 'types/api/zetaChain';

const SORT_SEQUENCE: Record<TransactionsSortingField, Array<TransactionsSortingValue>> = {
  value: [ 'value-desc', 'value-asc', 'default' ],
  fee: [ 'fee-desc', 'fee-asc', 'default' ],
  block_number: [ 'block_number-asc', 'default' ],
};

type Props = {

  // pagination: PaginationParams;
  // socketType?: TxsSocketType;
  // filter?: React.ReactNode;
  // filterValue?: AddressFromToFilter;
  enableTimeIncrement?: boolean;
  top?: number;
  items?: Array<ZetaChainCCTX>;
  isPlaceholderData: boolean;
  isError: boolean;
};

const ZetaChainCCTxs = ({
  // pagination,
  // filter,
  // filterValue,
  // socketType,
  // enableTimeIncrement,
  top,
  items,
  isPlaceholderData,
  isError,
}: Props) => {
  const content = (
    <>
      {/* <Box hideFrom="lg">
        <ZetaChainCCTxsList
          showBlockInfo={ showBlockInfo }
          socketType={ socketType }
          isLoading={ isPlaceholderData }
          enableTimeIncrement={ enableTimeIncrement }
          currentAddress={ currentAddress }
          items={ items }
        />
      </Box> */}
      <Box hideBelow="lg">
        <ZetaChainCCTxsTable
          txs={ items ?? [] }
          top={ top || 0 }
          isLoading={ isPlaceholderData }
        />
      </Box>
    </>
  );

  // const actionBar = isMobile ? (
  //   <TxsHeaderMobile
  //     mt={ -6 }
  //     sorting={ sort }
  //     setSorting={ setSorting }
  //     paginationProps={ pagination }
  //     showPagination={ pagination.isVisible }
  //     filterComponent={ filter }
  //     linkSlot={ currentAddress ? (
  //       <AddressCsvExportLink
  //         address={ currentAddress }
  //         params={{ type: 'transactions', filterType: 'address', filterValue }}
  //         isLoading={ pagination.isLoading }
  //       />
  //     ) : null
  //     }
  //   />
  // ) : null;

  return (
    <DataListDisplay
      isError={ isError }
      itemsNum={ items?.length }
      emptyText="There are no transactions."
      // actionBar={ actionBar }
    >
      { content }
    </DataListDisplay>
  );
};

export default ZetaChainCCTxs;
