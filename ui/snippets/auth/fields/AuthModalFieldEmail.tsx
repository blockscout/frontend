import { chakra, FormControl, Input } from '@chakra-ui/react';
import React from 'react';
import { useController, useFormContext } from 'react-hook-form';

import type { EmailFormFields } from '../types';

import { EMAIL_REGEXP } from 'lib/validations/email';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

interface Props {
  className?: string;
}

const AuthModalFieldEmail = ({ className }: Props) => {
  const { control } = useFormContext<EmailFormFields>();
  const { field, fieldState, formState } = useController<EmailFormFields, 'email'>({
    control,
    name: 'email',
    rules: { required: true, pattern: EMAIL_REGEXP },
  });

  const isDisabled = formState.isSubmitting;

  return (
    <FormControl className={ className } variant="floating" isDisabled={ isDisabled } isRequired size="md">
      <Input
        { ...field }
        required
        isInvalid={ Boolean(fieldState.error) }
        isDisabled={ isDisabled }
        autoComplete="off"
        bgColor="dialog_bg"
      />
      <InputPlaceholder text="Email" error={ fieldState.error }/>
    </FormControl>
  );
};

export default React.memo(chakra(AuthModalFieldEmail));
