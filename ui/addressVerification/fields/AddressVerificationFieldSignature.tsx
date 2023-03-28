import { FormControl, Input } from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';

import type { AddressVerificationFormFields } from '../types';

import InputPlaceholder from 'ui/shared/InputPlaceholder';

const AddressVerificationFieldSignature = () => {
  const { formState, control } = useFormContext<AddressVerificationFormFields>();

  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<AddressVerificationFormFields, 'signature'>}) => {
    const error = 'signature' in formState.errors ? formState.errors.signature : undefined;

    return (
      <FormControl variant="floating" id={ field.name } isRequired size="md">
        <Input
          { ...field }
          required
          isInvalid={ Boolean(error) }
          isDisabled={ formState.isSubmitting }
          autoComplete="off"
        />
        <InputPlaceholder text="Signature hash" error={ error }/>
      </FormControl>
    );
  }, [ formState.errors, formState.isSubmitting ]);

  return (
    <Controller
      name="signature"
      control={ control }
      render={ renderControl }
      rules={{ required: true }}
    />
  );
};

export default React.memo(AddressVerificationFieldSignature);
