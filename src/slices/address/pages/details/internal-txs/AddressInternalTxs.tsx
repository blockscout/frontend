// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import ActionBar from 'src/shell/page/action-bar/ActionBar';

import InternalTxsList from 'src/slices/internal-tx/components/InternalTxsList';
import InternalTxsTable from 'src/slices/internal-tx/components/InternalTxsTable';

import CsvExport from 'src/features/csv-export/components/CsvExport';

import useIsMounted from 'src/shared/hooks/useIsMounted';
import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';

import AddressTxsFilter from '../txs/AddressTxsFilter';
import useAddressInternalTxsQuery from './useAddressInternalTxsQuery';

type Props = {
  shouldRender?: boolean;
  isQueryEnabled?: boolean;
};
const AddressInternalTxs = ({ shouldRender = true, isQueryEnabled = true }: Props) => {
  const isMounted = useIsMounted();

  const { hash, query, filterValue, onFilterChange } = useAddressInternalTxsQuery({ enabled: isQueryEnabled });
  const { data, isPlaceholderData, isError, pagination } = query;

  if (!isMounted || !shouldRender) {
    return null;
  }

  const content = data?.items ? (
    <>
      <Box hideFrom="lg">
        <InternalTxsList data={ data.items } currentAddress={ hash } isLoading={ isPlaceholderData }/>
      </Box>
      <Box hideBelow="lg">
        <InternalTxsTable data={ data.items } currentAddress={ hash } isLoading={ isPlaceholderData }/>
      </Box>
    </>
  ) : null ;

  const actionBar = (
    <ActionBar mt={ -6 } justifyContent="left">
      <AddressTxsFilter
        initialValue={ filterValue }
        onFilterChange={ onFilterChange }
        hasActiveFilter={ Boolean(filterValue) }
        isLoading={ pagination.isLoading }
      />
      <CsvExport
        type="address_internal_txs"
        resourceName="general:address_csv_export_internal_txs"
        pathParams={{ hash }}
        queryParams={ filterValue ? {
          filter_type: 'address',
          filter_value: filterValue,
        } : undefined }
        loadingInitial={ pagination.isLoading }
        ml={{ base: 2, lg: 3 }}
      />
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  );

  return (
    <DataList
      isError={ isError }
      itemsNum={ data?.items.length }
      hasActiveFilters={ Boolean(filterValue) }
      emptyStateProps={{
        term: 'transaction',
      }}
      emptyText="There are no internal transactions for this address."
      actionBar={ actionBar }
    >
      { content }
    </DataList>
  );
};

export default AddressInternalTxs;
