// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import InternalTxsList from 'client/slices/internal-tx/components/InternalTxsList';
import InternalTxsTable from 'client/slices/internal-tx/components/InternalTxsTable';
import useInternalTxsQuery from 'client/slices/internal-tx/hooks/useInternalTxsQuery';

import useIsMobile from 'client/shared/hooks/useIsMobile';

import { FilterInput } from 'toolkit/components/filters/FilterInput';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';

const InternalTxs = () => {

  const isMobile = useIsMobile();

  const { query, searchTerm, debouncedSearchTerm, onSearchTermChange } = useInternalTxsQuery();
  const { isError, isPlaceholderData, data, pagination } = query;

  const filterInput = (
    <FilterInput
      w={{ base: '100%', lg: '350px' }}
      size="sm"
      onChange={ onSearchTermChange }
      placeholder="Search by transaction hash"
      initialValue={ searchTerm }
    />
  );

  const actionBar = (
    <>
      <Box mb={ 6 } display={{ base: 'flex', lg: 'none' }}>
        { filterInput }
      </Box>
      { (!isMobile || pagination.isVisible) && (
        <ActionBar mt={ -6 }>
          <Box display={{ base: 'none', lg: 'flex' }}>
            { filterInput }
          </Box>
          <Pagination ml="auto" { ...pagination }/>
        </ActionBar>
      ) }
    </>
  );

  const content = data?.items ? (
    <>
      <Box hideFrom="lg">
        <InternalTxsList data={ data.items } isLoading={ isPlaceholderData }/>
      </Box>
      <Box hideBelow="lg">
        <InternalTxsTable data={ data.items } isLoading={ isPlaceholderData }/>
      </Box>
    </>
  ) : null;

  return (
    <>
      <PageTitle
        title="Internal transactions"
        withTextAd
      />
      <DataListDisplay
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no internal transactions."
        hasActiveFilters={ Boolean(debouncedSearchTerm) }
        emptyStateProps={{
          term: 'internal transaction',
        }}
        actionBar={ actionBar }
      >
        { content }
      </DataListDisplay>
    </>
  );
};

export default InternalTxs;
