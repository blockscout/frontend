import { HStack, PinInput, PinInputField, Text } from '@chakra-ui/react';
import React from 'react';
import { useController, useFormContext } from 'react-hook-form';

import type { OtpCodeFormFields } from '../types';

const AuthModalFieldOtpCode = () => {
  const { control } = useFormContext<OtpCodeFormFields>();
  const { field, fieldState, formState } = useController<OtpCodeFormFields, 'code'>({
    control,
    name: 'code',
    rules: { required: true, minLength: 6, maxLength: 6 },
  });

  const isDisabled = formState.isSubmitting;

  return (
    <>
      <HStack>
        <PinInput otp placeholder="-" { ...field } isDisabled={ isDisabled } isInvalid={ Boolean(fieldState.error) }>
          <PinInputField borderRadius="base"/>
          <PinInputField borderRadius="base"/>
          <PinInputField borderRadius="base"/>
          <PinInputField borderRadius="base"/>
          <PinInputField borderRadius="base"/>
          <PinInputField borderRadius="base"/>
        </PinInput>
      </HStack>
      { fieldState.error?.message && <Text color="error" fontSize="xs" mt={ 1 }>{ fieldState.error.message }</Text> }
    </>
  );
};

export default React.memo(AuthModalFieldOtpCode);
