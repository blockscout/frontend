import { Box, createListCollection, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { VerifiedContractsFilters } from 'types/api/contracts';
import type { VerifiedContractsSorting, VerifiedContractsSortingField, VerifiedContractsSortingValue } from 'types/api/verifiedContracts';

import config from 'configs/app';
import useDebounce from 'lib/hooks/useDebounce';
import useIsMobile from 'lib/hooks/useIsMobile';
import getQueryParamString from 'lib/router/getQueryParamString';
import { VERIFIED_CONTRACT_INFO } from 'stubs/contract';
import { generateListStub } from 'stubs/utils';
import { FilterInput } from 'toolkit/components/filters/FilterInput';
import { apos } from 'toolkit/utils/htmlEntities';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import getSortParamsFromValue from 'ui/shared/sort/getSortParamsFromValue';
import getSortValueFromQuery from 'ui/shared/sort/getSortValueFromQuery';
import Sort from 'ui/shared/sort/Sort';
import { SORT_OPTIONS } from 'ui/verifiedContracts/utils';
import VerifiedContractsCounters from 'ui/verifiedContracts/VerifiedContractsCounters';
import VerifiedContractsFilter from 'ui/verifiedContracts/VerifiedContractsFilter';
import VerifiedContractsList from 'ui/verifiedContracts/VerifiedContractsList';
import VerifiedContractsTable from 'ui/verifiedContracts/VerifiedContractsTable';

const sortCollection = createListCollection({
  items: SORT_OPTIONS,
});

const VerifiedContracts = () => {
  const router = useRouter();
  const [ searchTerm, setSearchTerm ] = React.useState(getQueryParamString(router.query.q) || undefined);
  const [ type, setType ] = React.useState(getQueryParamString(router.query.filter) as VerifiedContractsFilters['filter'] || undefined);
  const [ sort, setSort ] =
    React.useState<VerifiedContractsSortingValue>(getSortValueFromQuery<VerifiedContractsSortingValue>(router.query, SORT_OPTIONS) ?? 'default');

  const debouncedSearchTerm = useDebounce(searchTerm || '', 300);

  const isMobile = useIsMobile();

  const { isError, isPlaceholderData, data, pagination, onFilterChange, onSortingChange } = useQueryWithPages({
    resourceName: 'general:verified_contracts',
    filters: { q: debouncedSearchTerm, filter: type },
    sorting: getSortParamsFromValue<VerifiedContractsSortingValue, VerifiedContractsSortingField, VerifiedContractsSorting['order']>(sort),
    options: {
      placeholderData: generateListStub<'general:verified_contracts'>(
        VERIFIED_CONTRACT_INFO,
        50,
        {
          next_page_params: {
            items_count: '50',
            smart_contract_id: '50',
          },
        },
      ),
    },
  });

  const handleSearchTermChange = React.useCallback((value: string) => {
    onFilterChange({ q: value, filter: type });
    setSearchTerm(value);
  }, [ type, onFilterChange ]);

  const handleTypeChange = React.useCallback((value: string | Array<string>) => {
    if (Array.isArray(value)) {
      return;
    }

    const filter = value === 'all' ? undefined : value as VerifiedContractsFilters['filter'];

    onFilterChange({ q: debouncedSearchTerm, filter });
    setType(filter);
  }, [ debouncedSearchTerm, onFilterChange ]);

  const handleSortChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setSort(value[0] as VerifiedContractsSortingValue);
    onSortingChange(value[0] === 'default' ? undefined : getSortParamsFromValue(value[0] as VerifiedContractsSortingValue));
  }, [ onSortingChange ]);

  const typeFilter = (
    <VerifiedContractsFilter
      onChange={ handleTypeChange }
      defaultValue={ type }
      hasActiveFilter={ Boolean(type) }
    />
  );

  const filterInput = (
    <FilterInput
      w={{ base: '100%', lg: '350px' }}
      size="sm"
      onChange={ handleSearchTermChange }
      placeholder="Search by contract name or address"
      initialValue={ searchTerm }
    />
  );

  const sortButton = (
    <Sort
      name="verified_contracts_sorting"
      defaultValue={ [ sort ] }
      collection={ sortCollection }
      onValueChange={ handleSortChange }
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
        <VerifiedContractsTable data={ data.items } sort={ sort } setSorting={ handleSortChange } isLoading={ isPlaceholderData }/>
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
      <DataListDisplay
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no verified contracts."
        filterProps={{
          emptyFilteredText: `Couldn${ apos }t find any contract that matches your query.`,
          hasActiveFilters: Boolean(searchTerm || type),
        }}
        actionBar={ actionBar }
      >
        { content }
      </DataListDisplay>
    </Box>
  );
};

export default VerifiedContracts;
