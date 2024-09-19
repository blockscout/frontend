import { Box, Hide, HStack, Show } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type {
  ValidatorsStabilityFilters,
  ValidatorsStabilitySorting,
  ValidatorsStabilitySortingField,
  ValidatorsStabilitySortingValue,
} from 'types/api/validators';

import config from 'configs/app';
// import useDebounce from 'lib/hooks/useDebounce';
import useIsMobile from 'lib/hooks/useIsMobile';
import { apos } from 'lib/html-entities';
import getQueryParamString from 'lib/router/getQueryParamString';
import { generateListStub } from 'stubs/utils';
import { VALIDATOR_STABILITY } from 'stubs/validators';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
// import FilterInput from 'ui/shared/filters/FilterInput';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import getSortParamsFromValue from 'ui/shared/sort/getSortParamsFromValue';
import getSortValueFromQuery from 'ui/shared/sort/getSortValueFromQuery';
import Sort from 'ui/shared/sort/Sort';
import { VALIDATORS_STABILITY_SORT_OPTIONS } from 'ui/validatorsStability/utils';
import ValidatorsCounters from 'ui/validatorsStability/ValidatorsCounters';
import ValidatorsFilter from 'ui/validatorsStability/ValidatorsFilter';
import ValidatorsList from 'ui/validatorsStability/ValidatorsList';
import ValidatorsTable from 'ui/validatorsStability/ValidatorsTable';

const ValidatorsStability = () => {
  const router = useRouter();
  // const [ searchTerm, setSearchTerm ] = React.useState(getQueryParamString(router.query.address_hash) || undefined);
  const [ statusFilter, setStatusFilter ] =
    React.useState(getQueryParamString(router.query.state_filter) as ValidatorsStabilityFilters['state_filter'] || undefined);
  const [ sort, setSort ] = React.useState<ValidatorsStabilitySortingValue | undefined>(
    getSortValueFromQuery<ValidatorsStabilitySortingValue>(router.query, VALIDATORS_STABILITY_SORT_OPTIONS),
  );

  // const debouncedSearchTerm = useDebounce(searchTerm || '', 300);

  const isMobile = useIsMobile();

  const { isError, isPlaceholderData, data, pagination, onFilterChange, onSortingChange } = useQueryWithPages({
    resourceName: 'validators_stability',
    filters: {
      // address_hash: debouncedSearchTerm,
      state_filter: statusFilter,
    },
    sorting: getSortParamsFromValue<ValidatorsStabilitySortingValue, ValidatorsStabilitySortingField, ValidatorsStabilitySorting['order']>(sort),
    options: {
      enabled: config.features.validators.isEnabled,
      placeholderData: generateListStub<'validators_stability'>(
        VALIDATOR_STABILITY,
        50,
        { next_page_params: null },
      ),
    },
  });

  // const handleSearchTermChange = React.useCallback((value: string) => {
  //   onFilterChange({
  //     address_hash: value,
  //     state_filter: statusFilter
  //   });
  //   setSearchTerm(value);
  // }, [ statusFilter, onFilterChange ]);

  const handleStateFilterChange = React.useCallback((value: string | Array<string>) => {
    if (Array.isArray(value)) {
      return;
    }

    const state = value === 'all' ? undefined : value as ValidatorsStabilityFilters['state_filter'];

    onFilterChange({
      // address_hash: debouncedSearchTerm,
      state_filter: state,
    });
    setStatusFilter(state);
  }, [ onFilterChange ]);

  const handleSortChange = React.useCallback((value?: ValidatorsStabilitySortingValue) => {
    setSort(value);
    onSortingChange(getSortParamsFromValue(value));
  }, [ onSortingChange ]);

  const filterMenu =
    <ValidatorsFilter onChange={ handleStateFilterChange } defaultValue={ statusFilter } hasActiveFilter={ Boolean(statusFilter) }/>;

  // const filterInput = (
  //   <FilterInput
  //     w={{ base: '100%', lg: '350px' }}
  //     size="xs"
  //     onChange={ handleSearchTermChange }
  //     placeholder="Search by validator's address hash"
  //     initialValue={ searchTerm }
  //   />
  // );

  const sortButton = (
    <Sort
      name="validators_sorting"
      defaultValue={ sort }
      options={ VALIDATORS_STABILITY_SORT_OPTIONS }
      onChange={ handleSortChange }
    />
  );

  const actionBar = (
    <>
      <HStack spacing={ 3 } mb={ 6 } display={{ base: 'flex', lg: 'none' }}>
        { filterMenu }
        { sortButton }
        { /* { filterInput } */ }
      </HStack>
      { (!isMobile || pagination.isVisible) && (
        <ActionBar mt={ -6 }>
          <HStack spacing={ 3 } display={{ base: 'none', lg: 'flex' }}>
            { filterMenu }
            { /* { filterInput } */ }
          </HStack>
          <Pagination ml="auto" { ...pagination }/>
        </ActionBar>
      ) }
    </>
  );

  const content = data?.items ? (
    <>
      <Show below="lg" ssr={ false }>
        <ValidatorsList data={ data.items } isLoading={ isPlaceholderData }/>
      </Show>
      <Hide below="lg" ssr={ false }>
        <ValidatorsTable data={ data.items } sort={ sort } setSorting={ handleSortChange } isLoading={ isPlaceholderData }/>
      </Hide>
    </>
  ) : null;

  return (
    <Box>
      <PageTitle title="Validators" withTextAd/>
      <ValidatorsCounters/>
      <DataListDisplay
        isError={ isError }
        items={ data?.items }
        emptyText="There are no validators."
        filterProps={{
          emptyFilteredText: `Couldn${ apos }t find any validator that matches your query.`,
          hasActiveFilters: Boolean(
            // searchTerm ||
            statusFilter,
          ),
        }}
        content={ content }
        actionBar={ actionBar }
      />
    </Box>
  );
};

export default ValidatorsStability;
