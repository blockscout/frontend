import { Flex, Input } from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';

import CheckboxInput from 'ui/shared/CheckboxInput';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

const ContractVerificationFieldOptimization = () => {
  const [ isEnabled, setIsEnabled ] = React.useState(true);
  const { formState, control } = useFormContext<FormFields>();

  const error = 'optimization_runs' in formState.errors ? formState.errors.optimization_runs : undefined;

  const handleCheckboxChange = React.useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);

  const renderCheckboxControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'is_optimization_enabled'>}) => (
    <Flex flexShrink={ 0 }>
      <CheckboxInput<FormFields, 'is_optimization_enabled'>
        text="Optimization enabled"
        field={ field }
        onChange={ handleCheckboxChange }
        isDisabled={ formState.isSubmitting }
      />
    </Flex>
  ), [ formState.isSubmitting, handleCheckboxChange ]);

  const renderInputControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'optimization_runs'>}) => {
    return (
      <Input
        { ...field }
        required
        isDisabled={ formState.isSubmitting }
        autoComplete="off"
        type="number"
        placeholder="Optimization runs"
        size="xs"
        minW="100px"
        maxW="200px"
        flexShrink={ 1 }
        isInvalid={ Boolean(error) }
      />
    );
  }, [ error, formState.isSubmitting ]);

  return (
    <ContractVerificationFormRow>
      <Flex columnGap={ 5 } h={{ base: 'auto', lg: '32px' }}>
        <Controller
          name="is_optimization_enabled"
          control={ control }
          render={ renderCheckboxControl }
        />
        { isEnabled && (
          <Controller
            name="optimization_runs"
            control={ control }
            render={ renderInputControl }
            rules={{ required: true }}
          />
        ) }
      </Flex>
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldOptimization);
