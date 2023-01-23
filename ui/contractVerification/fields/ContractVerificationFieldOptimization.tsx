import { FormControl, Input } from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';

import CheckboxInput from 'ui/shared/CheckboxInput';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

const ContractVerificationFieldOptimization = () => {
  const [ isEnabled, setIsEnabled ] = React.useState(false);
  const { formState, control } = useFormContext<FormFields>();

  const handleCheckboxChange = React.useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);

  const renderCheckboxControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'is_optimization_enabled'>}) => (
    <CheckboxInput<FormFields, 'is_optimization_enabled'>
      text="Optimization enabled"
      field={ field }
      onChange={ handleCheckboxChange }
      isDisabled={ formState.isSubmitting }
    />
  ), [ formState.isSubmitting, handleCheckboxChange ]);

  const renderInputControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'optimization_runs'>}) => {
    return (
      <FormControl variant="floating" id={ field.name } size={{ base: 'md', lg: 'lg' }}>
        <Input
          { ...field }
          required
          maxLength={ 255 }
          isDisabled={ formState.isSubmitting }
        />
        <InputPlaceholder text="Optimization runs"/>
      </FormControl>
    );
  }, [ formState.isSubmitting ]);

  return (
    <>
      <ContractVerificationFormRow>
        <Controller
          name="is_optimization_enabled"
          control={ control }
          render={ renderCheckboxControl }
        />
      </ContractVerificationFormRow>
      { isEnabled && (
        <ContractVerificationFormRow>
          <Controller
            name="optimization_runs"
            control={ control }
            render={ renderInputControl }
            rules={{ required: true }}
          />
        </ContractVerificationFormRow>
      ) }
    </>
  );
};

export default React.memo(ContractVerificationFieldOptimization);
