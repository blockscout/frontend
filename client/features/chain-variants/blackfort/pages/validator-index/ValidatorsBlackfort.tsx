// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, createListCollection, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type {
  ValidatorsBlackfortSorting,
  ValidatorsBlackfortSortingField,
  ValidatorsBlackfortSortingValue,
} from 'client/features/chain-variants/blackfort/types/api';

import { VALIDATOR_BLACKFORT } from 'client/features/chain-variants/blackfort/stubs/validators';

import Pagination from 'client/shared/pagination/Pagination';
import useQueryWithPages from 'client/shared/pagination/useQueryWithPages';
import { generateListStub } from 'client/shared/pagination/utils';

import config from 'configs/app';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import getSortParamsFromValue from 'ui/shared/sort/getSortParamsFromValue';
import getSortValueFromQuery from 'ui/shared/sort/getSortValueFromQuery';
import Sort from 'ui/shared/sort/Sort';

import { VALIDATORS_BLACKFORT_SORT_OPTIONS } from './utils';
import ValidatorsCounters from './ValidatorsCounters';
import ValidatorsList from './ValidatorsList';
import ValidatorsTable from './ValidatorsTable';

const sortCollection = createListCollection({
  items: VALIDATORS_BLACKFORT_SORT_OPTIONS,
});

const ValidatorsBlackfort = () => {
  const router = useRouter();
  const [ sort, setSort ] =
    React.useState<ValidatorsBlackfortSortingValue>(
      getSortValueFromQuery<ValidatorsBlackfortSortingValue>(router.query, VALIDATORS_BLACKFORT_SORT_OPTIONS) ?? 'default',
    );

  const { isError, isPlaceholderData, data, pagination, onSortingChange } = useQueryWithPages({
    resourceName: 'general:validators_blackfort',
    sorting: getSortParamsFromValue<ValidatorsBlackfortSortingValue, ValidatorsBlackfortSortingField, ValidatorsBlackfortSorting['order']>(sort),
    options: {
      enabled: config.features.validators.isEnabled,
      placeholderData: generateListStub<'general:validators_blackfort'>(
        VALIDATOR_BLACKFORT,
        50,
        { next_page_params: null },
      ),
    },
  });

  const handleSortChange = React.useCallback(({ value }: { value: Array<string> }) => {
    const sortValue = value[0] as ValidatorsBlackfortSortingValue;
    setSort(sortValue);
    onSortingChange(sortValue === 'default' ? undefined : getSortParamsFromValue(sortValue));
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
        <ValidatorsList data={ data.items } isLoading={ isPlaceholderData }/>
      </Box>
      <Box hideBelow="lg">
        <ValidatorsTable
          data={ data.items }
          sort={ sort }
          setSorting={ handleSortChange }
          isLoading={ isPlaceholderData }
          top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
        />
      </Box>
    </>
  ) : null;

  return (
    <Box>
      <PageTitle title="Validators" withTextAd/>
      <ValidatorsCounters/>
      <DataListDisplay
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no validators."
        actionBar={ actionBar }
      >
        { content }
      </DataListDisplay>
    </Box>
  );
};

export default ValidatorsBlackfort;
