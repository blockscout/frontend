// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import useDebounce from 'client/shared/hooks/useDebounce';
import useIsMobile from 'client/shared/hooks/useIsMobile';
import getQueryParamString from 'client/shared/router/get-query-param-string';

import { generateListStub } from 'stubs/utils';
import { FilterInput } from 'toolkit/components/filters/FilterInput';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

import { TAC_OPERATION } from '../../stubs';
import TacOperationsListItem from './TacOperationsListItem';
import TacOperationsTable from './TacOperationsTable';

const TacOperations = () => {
  const router = useRouter();
  const [ searchTerm, setSearchTerm ] = React.useState(getQueryParamString(router.query.q) || undefined);

  const debouncedSearchTerm = useDebounce(searchTerm || '', 300);

  const isMobile = useIsMobile();

  const { isError, isPlaceholderData, data, pagination, onFilterChange } = useQueryWithPages({
    resourceName: 'tac:operations',
    filters: { q: debouncedSearchTerm },
    options: {
      placeholderData: generateListStub<'tac:operations'>(
        TAC_OPERATION,
        50,
        { next_page_params: undefined },
      ),
    },
  });

  const handleSearchTermChange = React.useCallback((value: string) => {
    onFilterChange({ q: value });
    setSearchTerm(value);
  }, [ onFilterChange ]);

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
        { data.items.map(((item, index) => (
          <TacOperationsListItem
            key={ String(item.operation_id) + (isPlaceholderData ? index : '') }
            isLoading={ isPlaceholderData }
            item={ item }
          />
        ))) }
      </Box>
      <Box hideBelow="lg">
        <TacOperationsTable
          items={ data.items }
          isLoading={ isPlaceholderData }
        />
      </Box>
    </>
  ) : null;

  return (
    <>
      <PageTitle title="Operations" withTextAd/>
      <DataListDisplay
        isError={ isError }
        itemsNum={ data?.items?.length }
        emptyText="There are no operations."
        hasActiveFilters={ Boolean(debouncedSearchTerm) }
        emptyStateProps={{
          term: 'operation',
        }}
        actionBar={ actionBar }
      >
        { content }
      </DataListDisplay>
    </>
  );
};

export default React.memo(TacOperations);
