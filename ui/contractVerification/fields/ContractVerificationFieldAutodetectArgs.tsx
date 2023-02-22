import React from 'react';
import type { ControllerRenderProps } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';

import CheckboxInput from 'ui/shared/CheckboxInput';

import ContractVerificationFormRow from '../ContractVerificationFormRow';
import ContractVerificationFieldConstructorArgs from './ContractVerificationFieldConstructorArgs';

const ContractVerificationFieldAutodetectArgs = () => {
  const [ isOn, setIsOn ] = React.useState(true);
  const { formState, control, resetField } = useFormContext<FormFields>();

  const handleCheckboxChange = React.useCallback(() => {
    !isOn && resetField('constructor_args');
    setIsOn(prev => !prev);
  }, [ isOn, resetField ]);

  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'autodetect_constructor_args'>}) => (
    <CheckboxInput<FormFields, 'autodetect_constructor_args'>
      text="Try to fetch constructor arguments automatically"
      field={ field }
      isDisabled={ formState.isSubmitting }
      onChange={ handleCheckboxChange }
    />
  ), [ formState.isSubmitting, handleCheckboxChange ]);

  return (
    <>
      <ContractVerificationFormRow>
        <Controller
          name="autodetect_constructor_args"
          control={ control }
          render={ renderControl }
        />
      </ContractVerificationFormRow>
      { !isOn && <ContractVerificationFieldConstructorArgs/> }
    </>
  );
};

export default React.memo(ContractVerificationFieldAutodetectArgs);
