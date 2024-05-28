import { FormControl, Input } from '@chakra-ui/react';
import React from 'react';
import { useController, useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';

import InputPlaceholder from 'ui/shared/InputPlaceholder';

const PublicTagsSubmitFieldCompanyName = () => {
  const { control } = useFormContext<FormFields>();
  const { field, fieldState, formState } = useController<FormFields, 'companyName'>({ control, name: 'companyName' });

  const isDisabled = formState.isSubmitting;

  return (
    <FormControl variant="floating" isDisabled={ isDisabled } size={{ base: 'md', lg: 'lg' }}>
      <Input
        { ...field }
        isInvalid={ Boolean(fieldState.error) }
        isDisabled={ isDisabled }
        autoComplete="off"
      />
      <InputPlaceholder text="Company name" error={ fieldState.error }/>
    </FormControl>
  );
};

export default React.memo(PublicTagsSubmitFieldCompanyName);
