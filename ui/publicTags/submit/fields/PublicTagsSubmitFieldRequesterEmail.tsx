import { FormControl, Input } from '@chakra-ui/react';
import React from 'react';
import { useController, useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';

import { EMAIL_REGEXP } from 'lib/validations/email';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

const PublicTagsSubmitFieldRequesterEmail = () => {
  const { control } = useFormContext<FormFields>();
  const { field, fieldState, formState } = useController<FormFields, 'requesterEmail'>({
    control,
    name: 'requesterEmail',
    rules: { required: true, pattern: EMAIL_REGEXP },
  });

  const isDisabled = formState.isSubmitting;

  return (
    <FormControl variant="floating" isDisabled={ isDisabled } isRequired size={{ base: 'md', lg: 'lg' }}>
      <Input
        { ...field }
        required
        isInvalid={ Boolean(fieldState.error) }
        isDisabled={ isDisabled }
        autoComplete="off"
      />
      <InputPlaceholder text="Email" error={ fieldState.error }/>
    </FormControl>
  );
};

export default React.memo(PublicTagsSubmitFieldRequesterEmail);
