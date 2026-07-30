// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, createListCollection, HStack } from '@chakra-ui/react';
import React from 'react';

import ActionBar from 'src/shell/page/action-bar/ActionBar';
import PageTitle from 'src/shell/page/title/PageTitle';

import useVerifiedContractsQuery from 'src/slices/contract/hooks/useVerifiedContractsQuery';
import { SORT_OPTIONS } from 'src/slices/contract/pages/index/sort';
import VerifiedContractsCounters from 'src/slices/contract/pages/index/VerifiedContractsCounters';
import VerifiedContractsFilter from 'src/slices/contract/pages/index/VerifiedContractsFilter';
import VerifiedContractsList from 'src/slices/contract/pages/index/VerifiedContractsList';
import VerifiedContractsTable from 'src/slices/contract/pages/index/VerifiedContractsTable';

import ChainSelect from 'src/features/multichain/components/ChainSelect';
import { MultichainProvider } from 'src/features/multichain/context';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';
import Sort from 'src/shared/sort/Sort';

import { FilterInput } from 'src/toolkit/components/filters/FilterInput';

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
        <VerifiedContractsList data={ data.items } isLoading={ isPlaceholderData } resetKey={ query.queryHash }/>
      </Box>
      <Box hideBelow="lg">
        <VerifiedContractsTable data={ data.items } sort={ sort } setSorting={ onSortChange } isLoading={ isPlaceholderData } resetKey={ query.queryHash }/>
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
        <DataList
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
        </DataList>
      </MultichainProvider>
    </Box>
  );
};

export default React.memo(MultichainVerifiedContracts);
