// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, createListCollection, HStack } from '@chakra-ui/react';
import React from 'react';

import type {
  ValidatorsBlackfortSorting,
  ValidatorsBlackfortSortingField,
  ValidatorsBlackfortSortingValue,
} from 'src/features/chain-variants/blackfort/types/api';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';
import PageTitle from 'src/shell/page/title/PageTitle';

import { VALIDATOR_BLACKFORT } from 'src/features/chain-variants/blackfort/stubs/validators';

import config from 'src/config';
import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';
import useApiPaginatedQuery from 'src/shared/pagination/useApiPaginatedQuery';
import { generateListStub } from 'src/shared/pagination/utils';
import getSortParamsFromValue from 'src/shared/sort/get-sort-params-from-value';
import getSortValueFromQuery from 'src/shared/sort/get-sort-value-from-query';
import Sort from 'src/shared/sort/Sort';

import { VALIDATORS_BLACKFORT_SORT_OPTIONS } from './utils';
import ValidatorsCounters from './ValidatorsCounters';
import ValidatorsList from './ValidatorsList';
import ValidatorsTable from './ValidatorsTable';

const sortCollection = createListCollection({
  items: VALIDATORS_BLACKFORT_SORT_OPTIONS,
});

const ValidatorsBlackfort = () => {
  const { isError, isInitialLoading, isTransitioning, data, pagination, sorting, onSortingChange, queryHash } = useApiPaginatedQuery({
    resourceName: 'core:validators_blackfort',
    options: {
      enabled: config.features.validators.isEnabled,
      placeholderData: generateListStub<'core:validators_blackfort'>(
        VALIDATOR_BLACKFORT,
        50,
        { next_page_params: null },
      ),
    },
  });

  const sort = getSortValueFromQuery<ValidatorsBlackfortSortingValue>({ ...sorting }, VALIDATORS_BLACKFORT_SORT_OPTIONS) ?? 'default';

  const handleSortChange = React.useCallback(({ value }: { value: Array<string> }) => {
    onSortingChange(
      getSortParamsFromValue<ValidatorsBlackfortSortingValue, ValidatorsBlackfortSortingField, ValidatorsBlackfortSorting['order']>(
        value[0] as ValidatorsBlackfortSortingValue,
      ),
    );
  }, [ onSortingChange ]);

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
        { sortButton }
      </HStack>
      { pagination.isVisible && (
        <ActionBar mt={ -6 }>
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
          top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
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
        actionBar={ actionBar }
        isTransitioning={ isTransitioning }
      >
        { content }
      </DataList>
    </Box>
  );
};

export default ValidatorsBlackfort;
