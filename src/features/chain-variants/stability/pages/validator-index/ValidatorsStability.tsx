// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, createListCollection, HStack } from '@chakra-ui/react';
import React from 'react';

import type {
  ValidatorsStabilityFilters,
  ValidatorsStabilitySorting,
  ValidatorsStabilitySortingField,
  ValidatorsStabilitySortingValue,
} from 'src/features/chain-variants/stability/types/api';

import ActionBar from 'src/shell/page/action-bar/ActionBar';
import PageTitle from 'src/shell/page/title/PageTitle';

import { VALIDATOR_STABILITY } from 'src/features/chain-variants/stability/stubs/validators';

import config from 'src/config';
import useIsMobile from 'src/shared/hooks/useIsMobile';
import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';
import useApiPaginatedQuery from 'src/shared/pagination/useApiPaginatedQuery';
import { generateListStub } from 'src/shared/pagination/utils';
import getQueryParamString from 'src/shared/router/get-query-param-string';
import getSortParamsFromValue from 'src/shared/sort/get-sort-params-from-value';
import getSortValueFromQuery from 'src/shared/sort/get-sort-value-from-query';
import Sort from 'src/shared/sort/Sort';

import { VALIDATORS_STABILITY_SORT_OPTIONS } from './utils';
import ValidatorsCounters from './ValidatorsCounters';
import ValidatorsFilter from './ValidatorsFilter';
import ValidatorsList from './ValidatorsList';
import ValidatorsTable from './ValidatorsTable';

const sortCollection = createListCollection({
  items: VALIDATORS_STABILITY_SORT_OPTIONS,
});

const ValidatorsStability = () => {
  const isMobile = useIsMobile();

  const { isError, isInitialLoading, isTransitioning, data, pagination, filters, sorting, onFilterChange, onSortingChange, queryHash } = useApiPaginatedQuery({
    resourceName: 'core:validators_stability',
    options: {
      enabled: config.features.validators.isEnabled,
      placeholderData: generateListStub<'core:validators_stability'>(
        VALIDATOR_STABILITY,
        50,
        { next_page_params: null },
      ),
    },
  });

  const statusFilter = getQueryParamString(filters.state_filter) as ValidatorsStabilityFilters['state_filter'] || undefined;
  const sort = getSortValueFromQuery<ValidatorsStabilitySortingValue>({ ...sorting }, VALIDATORS_STABILITY_SORT_OPTIONS) ?? 'default';

  const handleStateFilterChange = React.useCallback((value: string | Array<string>) => {
    if (Array.isArray(value)) {
      return;
    }

    const state = value === 'all' ? undefined : value as ValidatorsStabilityFilters['state_filter'];

    onFilterChange({ state_filter: state });
  }, [ onFilterChange ]);

  const handleSortChange = React.useCallback(({ value }: { value: Array<string> }) => {
    onSortingChange(
      getSortParamsFromValue<ValidatorsStabilitySortingValue, ValidatorsStabilitySortingField, ValidatorsStabilitySorting['order']>(
        value[0] as ValidatorsStabilitySortingValue,
      ),
    );
  }, [ onSortingChange ]);

  const filterMenu =
    <ValidatorsFilter onChange={ handleStateFilterChange } defaultValue={ statusFilter } hasActiveFilter={ Boolean(statusFilter) }/>;

  const sortButton = (
    <Sort
      name="validators_sorting"
      defaultValue={ [ sort ] }
      collection={ sortCollection }
      onValueChange={ handleSortChange }
    />
  );

  const actionBar = (
    <>
      <HStack gap={ 3 } mb={ 6 } display={{ base: 'flex', lg: 'none' }}>
        { filterMenu }
        { sortButton }
      </HStack>
      { (!isMobile || pagination.isVisible) && (
        <ActionBar mt={ -6 }>
          <HStack gap={ 3 } display={{ base: 'none', lg: 'flex' }}>
            { filterMenu }
          </HStack>
          <Pagination ml="auto" { ...pagination }/>
        </ActionBar>
      ) }
    </>
  );

  const content = data?.items ? (
    <>
      <Box hideFrom="lg">
        <ValidatorsList data={ data.items } isLoading={ isInitialLoading } resetKey={ queryHash }/>
      </Box>
      <Box hideBelow="lg">
        <ValidatorsTable
          data={ data.items }
          sort={ sort }
          setSorting={ handleSortChange }
          isLoading={ isInitialLoading }
          resetKey={ queryHash }
        />
      </Box>
    </>
  ) : null;

  return (
    <Box>
      <PageTitle title="Validators" withTextAd/>
      <ValidatorsCounters/>
      <DataList
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no validators."
        hasActiveFilters={ Boolean(statusFilter) }
        emptyStateProps={{
          term: 'validator',
        }}
        actionBar={ actionBar }
        isTransitioning={ isTransitioning }
      >
        { content }
      </DataList>
    </Box>
  );
};

export default ValidatorsStability;
