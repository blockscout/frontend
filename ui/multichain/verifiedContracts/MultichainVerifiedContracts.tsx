// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, createListCollection, HStack } from '@chakra-ui/react';
import React from 'react';

import useVerifiedContractsQuery from 'client/slices/contract/hooks/useVerifiedContractsQuery';
import { SORT_OPTIONS } from 'client/slices/contract/pages/index/sort';
import VerifiedContractsCounters from 'client/slices/contract/pages/index/VerifiedContractsCounters';
import VerifiedContractsFilter from 'client/slices/contract/pages/index/VerifiedContractsFilter';
import VerifiedContractsList from 'client/slices/contract/pages/index/VerifiedContractsList';
import VerifiedContractsTable from 'client/slices/contract/pages/index/VerifiedContractsTable';

import useIsMobile from 'client/shared/hooks/useIsMobile';

import { MultichainProvider } from 'lib/contexts/multichain';
import { FilterInput } from 'toolkit/components/filters/FilterInput';
import ChainSelect from 'ui/multichain/components/ChainSelect';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import Sort from 'ui/shared/sort/Sort';

const sortCollection = createListCollection({
  items: SORT_OPTIONS,
});

const MultichainVerifiedContracts = () => {
  const isMobile = useIsMobile();

  const { query, type, searchTerm, sort, onSearchTermChange, onTypeChange, onSortChange } = useVerifiedContractsQuery({ isMultichain: true });
  const { isError, isPlaceholderData, data, pagination, chainValue, onChainValueChange } = query;

  const typeFilter = (
    <VerifiedContractsFilter
      onChange={ onTypeChange }
      defaultValue={ type }
      hasActiveFilter={ Boolean(type) }
    />
  );

  const filterInput = (
    <FilterInput
      w={{ base: '100%', lg: '350px' }}
      size="sm"
      onChange={ onSearchTermChange }
      placeholder="Search by contract name or address"
      initialValue={ searchTerm }
    />
  );

  const sortButton = (
    <Sort
      name="verified_contracts_sorting"
      defaultValue={ [ sort ] }
      collection={ sortCollection }
      onValueChange={ onSortChange }
      isLoading={ isPlaceholderData }
    />
  );

  const actionBar = (
    <>
      <HStack gap={ 3 } mb={ 6 } display={{ base: 'flex', lg: 'none' }}>
        { typeFilter }
        { sortButton }
        { filterInput }
      </HStack>
      { (!isMobile || pagination.isVisible) && (
        <ActionBar mt={ -6 }>
          <HStack gap={ 3 } display={{ base: 'none', lg: 'flex' }}>
            { typeFilter }
            { filterInput }
          </HStack>
          <Pagination ml="auto" { ...pagination }/>
        </ActionBar>
      ) }
    </>
  );

  const content = data?.items ? (
    <>
      <Box hideFrom="lg">
        <VerifiedContractsList data={ data.items } isLoading={ isPlaceholderData }/>
      </Box>
      <Box hideBelow="lg">
        <VerifiedContractsTable data={ data.items } sort={ sort } setSorting={ onSortChange } isLoading={ isPlaceholderData }/>
      </Box>
    </>
  ) : null;

  return (
    <Box>
      <PageTitle
        title="Verified contracts"
        withTextAd
      />
      <ChainSelect
        value={ chainValue }
        onValueChange={ onChainValueChange }
        mode="default"
        mb={ 3 }
      />
      <MultichainProvider chainId={ chainValue?.[0] }>
        <VerifiedContractsCounters/>
        <DataListDisplay
          isError={ isError }
          itemsNum={ data?.items.length }
          emptyText="There are no verified contracts."
          hasActiveFilters={ Boolean(searchTerm || type) }
          emptyStateProps={{
            term: 'contract',
          }}
          actionBar={ actionBar }
        >
          { content }
        </DataListDisplay>
      </MultichainProvider>
    </Box>
  );
};

export default React.memo(MultichainVerifiedContracts);
