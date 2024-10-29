import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { MethodType } from './types';

import RadioButtonGroup from 'ui/shared/radioButtonGroup/RadioButtonGroup';

import type { MethodsFilters } from './useMethodsFilters';

const TYPE_FILTER_OPTIONS: Array<{ value: MethodType; title: string }> = [
  { value: 'all', title: 'All' },
  { value: 'read', title: 'Read' },
  { value: 'write', title: 'Write' },
];

interface Props {
  defaultValue: MethodType;
  onChange: (filter: MethodsFilters) => void;
}

const ContractMethodsFilter = ({ defaultValue, onChange }: Props) => {

  const handleChange = React.useCallback((value: MethodType) => {
    onChange({ type: 'method_type', value });
  }, [ onChange ]);

  return (
    <Flex mb={ 6 }>
      <RadioButtonGroup<MethodType>
        name="contract-methods-filter"
        defaultValue={ defaultValue }
        options={ TYPE_FILTER_OPTIONS }
        onChange={ handleChange }
        w="fit-content"
      />
    </Flex>
  );
};

export default React.memo(ContractMethodsFilter);
