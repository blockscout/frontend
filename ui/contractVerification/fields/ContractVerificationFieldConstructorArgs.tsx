import { FormControl, Link, Textarea } from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';

import FieldError from 'ui/shared/forms/FieldError';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

const ContractVerificationFieldConstructorArgs = () => {
  const { formState, control } = useFormContext<FormFields>();

  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'constructor_args'>}) => {
    const error = 'constructor_args' in formState.errors ? formState.errors.constructor_args : undefined;

    return (
      <FormControl variant="floating" id={ field.name } size={{ base: 'md', lg: 'lg' }} isRequired>
        <Textarea
          { ...field }
          maxLength={ 255 }
          isDisabled={ formState.isSubmitting }
          isInvalid={ Boolean(error) }
          required
        />
        <InputPlaceholder text="ABI-encoded Constructor Arguments"/>
        { error?.message && <FieldError message={ error?.message }/> }
      </FormControl>
    );
  }, [ formState.errors, formState.isSubmitting ]);

  return (
    <ContractVerificationFormRow>
      <Controller
        name="constructor_args"
        control={ control }
        render={ renderControl }
        rules={{ required: true }}
      />
      <>
        <span>Add arguments in </span>
        <Link href="https://solidity.readthedocs.io/en/develop/abi-spec.html" target="_blank">ABI hex encoded form</Link>
        <span> if required by the contract. Constructor arguments are written right to left, and will be found at the end of the input created bytecode.</span>
        <span> They may also be </span>
        <Link href="https://abi.hashex.org/" target="_blank">parsed here</Link>
        <span>.</span>
      </>
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldConstructorArgs);
