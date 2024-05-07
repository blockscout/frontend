import { FormControl, Input } from '@chakra-ui/react';
import React from 'react';
import { useController, useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';

import InputPlaceholder from 'ui/shared/InputPlaceholder';

const PublicTagsSubmitFieldRequesterName = () => {
  const { control } = useFormContext<FormFields>();
  const { field, fieldState, formState } = useController<FormFields, 'requesterName'>({ control, name: 'requesterName', rules: { required: true } });

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
      <InputPlaceholder text="Your name" error={ fieldState.error }/>
    </FormControl>
  );
};

export default React.memo(PublicTagsSubmitFieldRequesterName);
