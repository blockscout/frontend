// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import ActionBar from 'src/shell/page/action-bar/ActionBar';
import PageTitle from 'src/shell/page/title/PageTitle';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';
import useApiPaginatedQuery from 'src/shared/pagination/useApiPaginatedQuery';
import { useDebouncedFilterChange } from 'src/shared/pagination/useDebouncedFilterChange';
import { generateListStub } from 'src/shared/pagination/utils';
import getQueryParamString from 'src/shared/router/get-query-param-string';

import { FilterInput } from 'src/toolkit/components/filters/FilterInput';

import { TAC_OPERATION } from '../../stubs';
import TacOperationsList from './TacOperationsList';
import TacOperationsTable from './TacOperationsTable';

const TacOperations = () => {
  const isMobile = useIsMobile();

  const { isError, isInitialLoading, isTransitioning, data, pagination, filters, onFilterChange, queryHash } = useApiPaginatedQuery({
    resourceName: 'tac:operations',
    options: {
      placeholderData: generateListStub<'tac:operations'>(
        TAC_OPERATION,
        50,
        { next_page_params: undefined },
      ),
    },
  });

  const searchTerm = getQueryParamString(filters.q) || undefined;

  const handleSearchTermChange = useDebouncedFilterChange((value) => onFilterChange({ q: value }));

  const filterInput = (
    <FilterInput
      w={{ base: '100%', lg: '460px' }}
      size="sm"
      onChange={ handleSearchTermChange }
      placeholder="Search by operation, tx hash, sender"
      initialValue={ searchTerm }
    />
  );

  const actionBar = (
    <>
      <Box gap={ 3 } mb={ 6 } display={{ base: 'flex', lg: 'none' }}>
        { filterInput }
      </Box>
      { (!isMobile || pagination.isVisible) && (
        <ActionBar mt={ -6 }>
          <Box gap={ 3 } display={{ base: 'none', lg: 'flex' }}>
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
        <TacOperationsList items={ data.items } isLoading={ isInitialLoading } resetKey={ queryHash }/>
      </Box>
      <Box hideBelow="lg">
        <TacOperationsTable items={ data.items } isLoading={ isInitialLoading } resetKey={ queryHash }/>
      </Box>
    </>
  ) : null;

  return (
    <>
      <PageTitle title="Operations" withTextAd/>
      <DataList
        isError={ isError }
        itemsNum={ data?.items?.length }
        emptyText="There are no operations."
        hasActiveFilters={ Boolean(searchTerm) }
        emptyStateProps={{
          term: 'operation',
        }}
        actionBar={ actionBar }
        isTransitioning={ isTransitioning }
      >
        { content }
      </DataList>
    </>
  );
};

export default React.memo(TacOperations);
