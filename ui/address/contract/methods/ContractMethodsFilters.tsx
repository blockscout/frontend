import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { MethodType } from './types';

import FilterInput from 'ui/shared/filters/FilterInput';
import RadioButtonGroup from 'ui/shared/radioButtonGroup/RadioButtonGroup';

import type { MethodsFilters } from './useMethodsFilters';
import { TYPE_FILTER_OPTIONS } from './utils';

interface Props {
  defaultMethodType: MethodType;
  defaultSearchTerm: string;
  onChange: (filter: MethodsFilters) => void;
  isLoading?: boolean;
}

const ContractMethodsFilters = ({ defaultMethodType, defaultSearchTerm, onChange, isLoading }: Props) => {

  const handleTypeChange = React.useCallback((value: MethodType) => {
    onChange({ type: 'method_type', value });
  }, [ onChange ]);

  const handleSearchTermChange = React.useCallback((value: string) => {
    onChange({ type: 'method_name', value });
  }, [ onChange ]);

  return (
    <Flex columnGap={ 3 } rowGap={ 3 } flexDir={{ base: 'column', lg: 'row' }}>
      <RadioButtonGroup<MethodType>
        name="contract-methods-filter"
        defaultValue={ defaultMethodType }
        options={ TYPE_FILTER_OPTIONS }
        onChange={ handleTypeChange }
        w={{ lg: 'fit-content' }}
        isLoading={ isLoading }
      />
      <FilterInput
        initialValue={ defaultSearchTerm }
        onChange={ handleSearchTermChange }
        placeholder="Search by method name"
        w={{ base: '100%', lg: '450px' }}
        size="xs"
        isLoading={ isLoading }
      />
    </Flex>
  );
};

export default React.memo(ContractMethodsFilters);
