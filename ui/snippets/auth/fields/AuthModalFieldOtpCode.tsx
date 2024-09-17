import { FormControl, Input } from '@chakra-ui/react';
import React from 'react';
import { useController, useFormContext } from 'react-hook-form';

import type { OtpCodeFormFields } from '../types';

import InputPlaceholder from 'ui/shared/InputPlaceholder';

const AuthModalFieldOtpCode = () => {
  const { control } = useFormContext<OtpCodeFormFields>();
  const { field, fieldState, formState } = useController<OtpCodeFormFields, 'code'>({
    control,
    name: 'code',
    rules: { required: true, minLength: 6, maxLength: 6 },
  });

  const isDisabled = formState.isSubmitting;

  return (
    <FormControl variant="floating" isDisabled={ isDisabled } isRequired size="md">
      <Input
        { ...field }
        required
        isInvalid={ Boolean(fieldState.error) }
        isDisabled={ isDisabled }
        type="number"
        minLength={ 6 }
        maxLength={ 6 }
        autoComplete="one-time-code"
      />
      <InputPlaceholder text="Confirmation code" error={ fieldState.error }/>
    </FormControl>
  );
};

export default React.memo(AuthModalFieldOtpCode);
