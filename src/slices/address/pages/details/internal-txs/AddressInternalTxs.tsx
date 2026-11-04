// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import ActionBar from 'src/shell/page/action-bar/ActionBar';

import InternalTxsTable from 'src/slices/internal-tx/components/InternalTxsTable';
import InternalTxsZeroValueSwitch from 'src/slices/internal-tx/components/InternalTxsZeroValueSwitch';

import CsvExport from 'src/features/csv-export/components/CsvExport';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import useIsMounted from 'src/shared/hooks/useIsMounted';
import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';

import { TableContainerScrollable } from 'src/toolkit/chakra/table';

import AddressTxsFilter from '../txs/AddressTxsFilter';
import useAddressInternalTxsQuery from './useAddressInternalTxsQuery';

type Props = {
  shouldRender?: boolean;
  isQueryEnabled?: boolean;
};
const AddressInternalTxs = ({ shouldRender = true, isQueryEnabled = true }: Props) => {
  const isMounted = useIsMounted();
  const isMobile = useIsMobile();

  const { hash, query, filterValue, onFilterChange } = useAddressInternalTxsQuery({ enabled: isQueryEnabled });
  const { data, isInitialLoading, isTransitioning, isError, pagination, isZeroValueShown, onZeroValueToggle } = query;

  if (!isMounted || !shouldRender) {
    return null;
  }

  const content = data?.items ? (
    <TableContainerScrollable>
      <InternalTxsTable data={ data.items } currentAddress={ hash } isLoading={ isInitialLoading } resetKey={ query.queryHash }/>
    </TableContainerScrollable>
  ) : null ;

  const controls = (
    <>
      <AddressTxsFilter
        initialValue={ filterValue }
        onFilterChange={ onFilterChange }
        hasActiveFilter={ Boolean(filterValue) }
        isLoading={ pagination.isLoading }
      />
      <CsvExport
        type="address_internal_txs"
        resourceName="core:address_csv_export_internal_txs"
        pathParams={{ hash }}
        queryParams={ filterValue ? {
          filter_type: 'address',
          filter_value: filterValue,
        } : undefined }
        loadingInitial={ pagination.isLoading }
        ml={{ base: 2, lg: 3 }}
      />
      <InternalTxsZeroValueSwitch
        isChecked={ isZeroValueShown }
        onChange={ onZeroValueToggle }
        isLoading={ pagination.isLoading }
        ml={{ base: 'auto', lg: 6 }}
      />
    </>
  );

  const actionBar = (
    <>
      { isMobile && <Flex mb={ 6 } alignItems="center">{ controls }</Flex> }
      { (!isMobile || pagination.isVisible) && (
        <ActionBar mt={ -6 } justifyContent="left">
          { !isMobile && controls }
          <Pagination ml="auto" { ...pagination }/>
        </ActionBar>
      ) }
    </>
  );

  return (
    <DataList
      isError={ isError }
      itemsNum={ data?.items.length }
      hasActiveFilters={ Boolean(filterValue) }
      isTransitioning={ isTransitioning }
      emptyStateProps={{
        term: 'transaction',
      }}
      emptyText="There are no internal transactions for this address."
      actionBar={ actionBar }
      showActionBarIfEmpty
    >
      { content }
    </DataList>
  );
};

export default AddressInternalTxs;
