import { Box } from '@chakra-ui/react';
import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';

import { MultichainProvider } from 'lib/contexts/multichain';
import { apos } from 'toolkit/utils/htmlEntities';
import AddressCsvExportLink from 'ui/address/AddressCsvExportLink';
import AddressTxsFilter from 'ui/address/AddressTxsFilter';
import useAddressInternalTxsQuery from 'ui/address/useAddressInternalTxsQuery';
import InternalTxsList from 'ui/internalTxs/InternalTxsList';
import InternalTxsTable from 'ui/internalTxs/InternalTxsTable';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import ChainSelect from 'ui/shared/multichain/ChainSelect';
import Pagination from 'ui/shared/pagination/Pagination';

import getAvailableChainIds from './getAvailableChainIds';

interface Props {
  addressData: multichain.GetAddressResponse | undefined;
  isLoading: boolean;
}

const OpSuperchainAddressInternalTxs = ({ addressData, isLoading }: Props) => {
  const chainIds = React.useMemo(() => getAvailableChainIds(addressData), [ addressData ]);

  const { hash, query, filterValue, onFilterChange } = useAddressInternalTxsQuery({
    enabled: !isLoading,
    isMultichain: true,
    chainIds,
  });
  const { data, isPlaceholderData, isError, pagination } = query;

  const content = data?.items ? (
    <MultichainProvider chainId={ query.chainValue?.[0] }>
      <Box hideFrom="lg">
        <InternalTxsList data={ data.items } currentAddress={ hash } isLoading={ isPlaceholderData }/>
      </Box>
      <Box hideBelow="lg">
        <InternalTxsTable data={ data.items } currentAddress={ hash } isLoading={ isPlaceholderData }/>
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
        value={ query.chainValue }
        onValueChange={ query.onChainValueChange }
        chainIds={ chainIds }
        ml={ 2 }
      />
      <AddressCsvExportLink
        address={ hash }
        isLoading={ pagination.isLoading }
        params={{ type: 'internal-transactions', filterType: 'address', filterValue }}
        ml={{ base: 2, lg: 'auto' }}
      />
      <Pagination ml={{ base: 'auto', lg: 8 }} { ...pagination }/>
    </ActionBar>
  );

  return (
    <DataListDisplay
      isError={ isError }
      itemsNum={ data?.items.length }
      filterProps={{ emptyFilteredText: `Couldn${ apos }t find any transaction that matches your query.`, hasActiveFilters: Boolean(filterValue) }}
      emptyText="There are no internal transactions for this address."
      showActionBarIfEmpty
      showActionBarIfError
      actionBar={ actionBar }
    >
      { content }
    </DataListDisplay>
  );
};

export default React.memo(OpSuperchainAddressInternalTxs);
