// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { PaginationParams } from 'src/shared/pagination/types';
import type { AddressFromToFilter } from 'src/slices/address/types/api';
import type { Transaction, TransactionsSortingField, TransactionsSortingValue } from 'src/slices/tx/types/api';
import type { TxsSocketType } from 'src/slices/tx/types/socket';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import CsvExport from 'src/features/csv-export/components/CsvExport';
import useDescribeTxs from 'src/features/tx-interpretation/noves/hooks/useDescribeTxs';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import DataList from 'src/shared/lists/DataList';
import getNextSortValue from 'src/shared/sort/get-next-sort-value';

import { TableContainerScrollable } from 'src/toolkit/chakra/table';

import TxsHeaderMobile from './TxsHeaderMobile';
import TxsList from './TxsList';
import TxsTable from './TxsTable';

const SORT_SEQUENCE: Record<TransactionsSortingField, Array<TransactionsSortingValue>> = {
  value: [ 'value-desc', 'value-asc', 'default' ],
  fee: [ 'fee-desc', 'fee-asc', 'default' ],
  block_number: [ 'block_number-asc', 'default' ],
};

type Props = {
  pagination: PaginationParams;
  showBlockInfo?: boolean;
  socketType?: TxsSocketType;
  currentAddress?: string;
  filter?: React.ReactNode;
  filterValue?: AddressFromToFilter;
  enableTimeIncrement?: boolean;
  top?: number;
  items?: Array<Transaction>;
  isPlaceholderData: boolean;
  isError: boolean;
  setSorting?: (value: TransactionsSortingValue) => void;
  sort: TransactionsSortingValue;
  stickyHeader?: boolean;
  showTableView?: boolean;
};

const TxsContent = ({
  pagination,
  filter,
  filterValue,
  showBlockInfo = true,
  socketType,
  currentAddress,
  enableTimeIncrement,
  top,
  items,
  isPlaceholderData,
  isError,
  setSorting,
  sort,
  stickyHeader = true,
  showTableView,
}: Props) => {
  const isMobile = useIsMobile();

  const isTableView = isMobile ? showTableView : true;
  const isLoading = isPlaceholderData;

  const onSortToggle = React.useCallback((field: TransactionsSortingField) => {
    const value = getNextSortValue<TransactionsSortingField, TransactionsSortingValue>(SORT_SEQUENCE, field)(sort);
    setSorting?.(value);
  }, [ sort, setSorting ]);

  const translationQuery = useDescribeTxs(items, currentAddress, isPlaceholderData);

  const content = (() => {
    if (items && items.length > 0) {
      if (isTableView) {
        return (
          <TableContainerScrollable>
            <TxsTable
              txs={ items }
              sort={ sort }
              onSortToggle={ setSorting ? onSortToggle : undefined }
              showBlockInfo={ showBlockInfo }
              socketType={ socketType }
              top={ top || (pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0) }
              currentAddress={ currentAddress }
              enableTimeIncrement={ enableTimeIncrement }
              isLoading={ isLoading }
              stickyHeader={ !isMobile && stickyHeader }
              translationQuery={ translationQuery }
            />
          </TableContainerScrollable>
        );
      }
      return (
        <TxsList
          showBlockInfo={ showBlockInfo }
          socketType={ socketType }
          isLoading={ isLoading }
          enableTimeIncrement={ enableTimeIncrement }
          currentAddress={ currentAddress }
          items={ items }
          translationQuery={ translationQuery }
        />
      );
    }
    return null;
  })();

  const actionBar = isMobile ? (
    <TxsHeaderMobile
      mt={ -6 }
      sorting={ sort }
      setSorting={ !isTableView ? setSorting : undefined }
      paginationProps={ pagination }
      showPagination={ pagination.isVisible }
      filterComponent={ filter }
      linkSlot={ currentAddress ? (
        <CsvExport
          type="address_txs"
          resourceName="core:address_csv_export_txs"
          pathParams={{ hash: currentAddress }}
          queryParams={ filterValue ? {
            filter_type: 'address',
            filter_value: filterValue,
          } : undefined }
          loadingInitial={ pagination.isLoading }
        />
      ) : null }
    />
  ) : null;

  return (
    <DataList
      isError={ isError }
      itemsNum={ items?.length }
      emptyText="There are no transactions."
      actionBar={ actionBar }
      hasActiveFilters={ Boolean(filterValue) }
      emptyStateProps={{
        term: 'transaction',
      }}
    >
      { content }
    </DataList>
  );
};

export default TxsContent;
