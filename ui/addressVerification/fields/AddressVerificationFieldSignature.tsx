import { FormControl, Input } from '@chakra-ui/react';
import React from 'react';
import type { Control, ControllerRenderProps, FormState } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { AddressVerificationFormSecondStepFields } from '../types';

import { SIGNATURE_REGEXP } from 'lib/validations/signature';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

interface Props {
  formState: FormState<AddressVerificationFormSecondStepFields>;
  control: Control<AddressVerificationFormSecondStepFields>;
}

const AddressVerificationFieldSignature = ({ formState, control }: Props) => {

  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<AddressVerificationFormSecondStepFields, 'signature'>}) => {
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
      rules={{ required: true, pattern: SIGNATURE_REGEXP }}
    />
  );
};

export default React.memo(AddressVerificationFieldSignature);
