import { Box, Hide, HStack, Show } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type {
  ValidatorsBlackfortSorting,
  ValidatorsBlackfortSortingField,
  ValidatorsBlackfortSortingValue,
} from 'types/api/validators';

import config from 'configs/app';
import { generateListStub } from 'stubs/utils';
import { VALIDATOR_BLACKFORT } from 'stubs/validators';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import getSortParamsFromValue from 'ui/shared/sort/getSortParamsFromValue';
import getSortValueFromQuery from 'ui/shared/sort/getSortValueFromQuery';
import Sort from 'ui/shared/sort/Sort';
import { VALIDATORS_BLACKFORT_SORT_OPTIONS } from 'ui/validatorsBlackfort/utils';
import ValidatorsCounters from 'ui/validatorsBlackfort/ValidatorsCounters';
import ValidatorsList from 'ui/validatorsBlackfort/ValidatorsList';
import ValidatorsTable from 'ui/validatorsBlackfort/ValidatorsTable';

const ValidatorsBlackfort = () => {
  const router = useRouter();
  const [ sort, setSort ] =
    React.useState<ValidatorsBlackfortSortingValue | undefined>(
      getSortValueFromQuery<ValidatorsBlackfortSortingValue>(router.query, VALIDATORS_BLACKFORT_SORT_OPTIONS),
    );

  const { isError, isPlaceholderData, data, pagination, onSortingChange } = useQueryWithPages({
    resourceName: 'validators_blackfort',
    sorting: getSortParamsFromValue<ValidatorsBlackfortSortingValue, ValidatorsBlackfortSortingField, ValidatorsBlackfortSorting['order']>(sort),
    options: {
      enabled: config.features.validators.isEnabled,
      placeholderData: generateListStub<'validators_blackfort'>(
        VALIDATOR_BLACKFORT,
        50,
        { next_page_params: null },
      ),
    },
  });

  const handleSortChange = React.useCallback((value?: ValidatorsBlackfortSortingValue) => {
    setSort(value);
    onSortingChange(getSortParamsFromValue(value));
  }, [ onSortingChange ]);

  const sortButton = (
    <Sort
      name="validators_sorting"
      defaultValue={ sort }
      options={ VALIDATORS_BLACKFORT_SORT_OPTIONS }
      onChange={ handleSortChange }
    />
  );

  const actionBar = (
    <>
      <HStack spacing={ 3 } mb={ 6 } display={{ base: 'flex', lg: 'none' }}>
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
      <Show below="lg" ssr={ false }>
        <ValidatorsList data={ data.items } isLoading={ isPlaceholderData }/>
      </Show>
      <Hide below="lg" ssr={ false }>
        <ValidatorsTable
          data={ data.items }
          sort={ sort }
          setSorting={ handleSortChange }
          isLoading={ isPlaceholderData }
          top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
        />
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
        content={ content }
        actionBar={ actionBar }
      />
    </Box>
  );
};

export default ValidatorsBlackfort;
