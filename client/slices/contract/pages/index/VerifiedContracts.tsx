// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, createListCollection, HStack } from '@chakra-ui/react';
import config from 'client/config';
import React from 'react';

import ActionBar from 'client/shell/page/action-bar/ActionBar';
import PageTitle from 'client/shell/page/title/PageTitle';

import useVerifiedContractsQuery from 'client/slices/contract/hooks/useVerifiedContractsQuery';
import VerifiedContractsCounters from 'client/slices/contract/pages/index/VerifiedContractsCounters';
import VerifiedContractsFilter from 'client/slices/contract/pages/index/VerifiedContractsFilter';
import VerifiedContractsList from 'client/slices/contract/pages/index/VerifiedContractsList';
import VerifiedContractsTable from 'client/slices/contract/pages/index/VerifiedContractsTable';

import useIsMobile from 'client/shared/hooks/useIsMobile';
import DataList from 'client/shared/lists/DataList';
import Pagination from 'client/shared/pagination/Pagination';
import Sort from 'client/shared/sort/Sort';

import { FilterInput } from 'toolkit/components/filters/FilterInput';

import { SORT_OPTIONS } from './sort';

const sortCollection = createListCollection({
  items: SORT_OPTIONS,
});

const VerifiedContracts = () => {
  const isMobile = useIsMobile();

  const { query, type, searchTerm, debouncedSearchTerm, sort, onSearchTermChange, onTypeChange, onSortChange } = useVerifiedContractsQuery();
  const { isError, isPlaceholderData, data, pagination } = query;

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
        title={ config.meta.seo.enhancedDataEnabled ? `Verified ${ config.chain.name } contracts` : 'Verified contracts' }
        withTextAd
      />
      <VerifiedContractsCounters/>
      <DataList
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no verified contracts."
        hasActiveFilters={ Boolean(debouncedSearchTerm || type) }
        emptyStateProps={{
          term: 'contract',
        }}
        actionBar={ actionBar }
      >
        { content }
      </DataList>
    </Box>
  );
};

export default VerifiedContracts;
