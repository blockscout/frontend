// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';

import ActionBar from 'src/shell/page/action-bar/ActionBar';

import useAddressInternalTxsQuery from 'src/slices/address/pages/details/internal-txs/useAddressInternalTxsQuery';
import AddressTxsFilter from 'src/slices/address/pages/details/txs/AddressTxsFilter';
import InternalTxsList from 'src/slices/internal-tx/components/InternalTxsList';
import InternalTxsTable from 'src/slices/internal-tx/components/InternalTxsTable';

import CsvExport from 'src/features/csv-export/components/CsvExport';
import ChainSelect from 'src/features/multichain/components/ChainSelect';
import { MultichainProvider } from 'src/features/multichain/context';
import { useChainValue } from 'src/features/multichain/hooks/useChainValue';

import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';

import getAvailableChainIds from './get-available-chain-ids';

interface Props {
  addressData: multichain.GetAddressResponse | undefined;
  isLoading: boolean;
}

const MultichainAddressInternalTxs = ({ addressData, isLoading }: Props) => {
  const chainIds = React.useMemo(() => getAvailableChainIds(addressData), [ addressData ]);
  const { chainValue, chain: chainData, onChainValueChange } = useChainValue({ chainIds });

  const { hash, query, filterValue, onFilterChange } = useAddressInternalTxsQuery({
    enabled: !isLoading && chainIds.length > 0,
    chain: chainData,
  });
  const { data, isPlaceholderData, isError, pagination } = query;

  if (chainIds.length === 0) {
    return <p>There are no internal transactions.</p>;
  }

  const content = data?.items ? (
    <MultichainProvider chainId={ chainData?.id }>
      <Box hideFrom="lg">
        <InternalTxsList data={ data.items } currentAddress={ hash } isLoading={ isPlaceholderData } resetKey={ query.queryHash }/>
      </Box>
      <Box hideBelow="lg">
        <InternalTxsTable data={ data.items } currentAddress={ hash } isLoading={ isPlaceholderData } resetKey={ query.queryHash }/>
      </Box>
    </MultichainProvider>
  ) : null ;

  const actionBar = (
    <ActionBar mt={ -6 } justifyContent="left">
      <AddressTxsFilter
        initialValue={ filterValue }
        onFilterChange={ onFilterChange }
        hasActiveFilter={ Boolean(filterValue) }
        isLoading={ pagination.isLoading }
      />
      <ChainSelect
        loading={ pagination.isLoading }
        value={ chainValue }
        onValueChange={ onChainValueChange }
        chainIds={ chainIds }
        ml={ 2 }
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
        chainData={ chainData }
        ml={ 2 }
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
      emptyText="There are no internal transactions."
      showActionBarIfEmpty
      showActionBarIfError
      actionBar={ actionBar }
    >
      { content }
    </DataList>
  );
};

export default React.memo(MultichainAddressInternalTxs);
