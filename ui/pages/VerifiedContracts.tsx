import { Box, Hide, HStack, Show } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { VerifiedContractsFilters } from 'types/api/contracts';

import useDebounce from 'lib/hooks/useDebounce';
import useIsMobile from 'lib/hooks/useIsMobile';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import { apos } from 'lib/html-entities';
import getQueryParamString from 'lib/router/getQueryParamString';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import FilterInput from 'ui/shared/filters/FilterInput';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/Pagination';
import Sort from 'ui/shared/sort/Sort';
import type { SortField, Sort as TSort } from 'ui/verifiedContracts/utils';
import { SORT_OPTIONS, sortFn, getNextSortValue } from 'ui/verifiedContracts/utils';
import VerifiedContractsCounters from 'ui/verifiedContracts/VerifiedContractsCounters';
import VerifiedContractsFilter from 'ui/verifiedContracts/VerifiedContractsFilter';
import VerifiedContractsList from 'ui/verifiedContracts/VerifiedContractsList';
import VerifiedContractsTable from 'ui/verifiedContracts/VerifiedContractsTable';

const VerifiedContracts = () => {
  const router = useRouter();
  const [ searchTerm, setSearchTerm ] = React.useState(getQueryParamString(router.query.q) || undefined);
  const [ type, setType ] = React.useState(getQueryParamString(router.query.filter) as VerifiedContractsFilters['filter'] || undefined);
  const [ sort, setSort ] = React.useState<TSort>();

  const debouncedSearchTerm = useDebounce(searchTerm || '', 300);

  const isMobile = useIsMobile();

  const { isError, isLoading, data, isPaginationVisible, pagination, onFilterChange } = useQueryWithPages({
    resourceName: 'verified_contracts',
    filters: { q: debouncedSearchTerm, filter: type },
  });

  const handleSearchTermChange = React.useCallback((value: string) => {
    onFilterChange({ q: value, filter: type });
    setSearchTerm(value);
  }, [ type, onFilterChange ]);

  const handleTypeChange = React.useCallback((value: string | Array<string>) => {
    if (Array.isArray(value)) {
      return;
    }

    if ((value === 'vyper' || value === 'solidity')) {
      onFilterChange({ q: debouncedSearchTerm, filter: value });
      setType(value);
      return;
    }

    onFilterChange({ q: debouncedSearchTerm, filter: undefined });
    setType(undefined);
  }, [ debouncedSearchTerm, onFilterChange ]);

  const handleSortToggle = React.useCallback((field: SortField) => {
    return () => {
      setSort(getNextSortValue(field));
    };
  }, []);

  const typeFilter = <VerifiedContractsFilter onChange={ handleTypeChange } defaultValue={ type } isActive={ Boolean(type) }/>;

  const filterInput = (
    <FilterInput
      w={{ base: '100%', lg: '350px' }}
      size="xs"
      onChange={ handleSearchTermChange }
      placeholder="Search by contract name or address"
      initialValue={ searchTerm }
    />
  );

  const sortButton = (
    <Sort
      options={ SORT_OPTIONS }
      sort={ sort }
      setSort={ setSort }
    />
  );

  const actionBar = (
    <>
      <HStack spacing={ 3 } mb={ 6 } display={{ base: 'flex', lg: 'none' }}>
        { typeFilter }
        { sortButton }
        { filterInput }
      </HStack>
      { (!isMobile || isPaginationVisible) && (
        <ActionBar mt={ -6 }>
          <HStack spacing={ 3 } display={{ base: 'none', lg: 'flex' }}>
            { typeFilter }
            { filterInput }
          </HStack>
          { isPaginationVisible && <Pagination ml="auto" { ...pagination }/> }
        </ActionBar>
      ) }
    </>
  );

  const sortedData = data?.items.slice().sort(sortFn(sort));

  const content = sortedData ? (
    <>
      <Show below="lg" ssr={ false }>
        <VerifiedContractsList data={ sortedData }/>
      </Show>
      <Hide below="lg" ssr={ false }>
        <VerifiedContractsTable data={ sortedData } sort={ sort } onSortToggle={ handleSortToggle }/>
      </Hide>
    </>
  ) : null;

  return (
    <Box>
      <PageTitle title="Verified contracts" withTextAd/>
      <VerifiedContractsCounters/>
      <DataListDisplay
        isError={ isError }
        isLoading={ isLoading }
        items={ data?.items }
        skeletonProps={{ skeletonDesktopColumns: [ '50%', '130px', '130px', '50%', '80px', '110px' ] }}
        emptyText="There are no verified contracts."
        filterProps={{
          emptyFilteredText: `Couldn${ apos }t find any contract that matches your query.`,
          hasActiveFilters: Boolean(searchTerm || type),
        }}
        content={ content }
        actionBar={ actionBar }
      />
    </Box>
  );
};

export default VerifiedContracts;
