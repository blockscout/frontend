import { FormControl, Input } from '@chakra-ui/react';
import React from 'react';
import { useController, useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';

import { validator as urlValidator } from 'lib/validations/url';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

const PublicTagsSubmitFieldCompanyWebsite = () => {
  const { control } = useFormContext<FormFields>();
  const { field, fieldState, formState } = useController<FormFields, 'companyWebsite'>({ control, name: 'companyWebsite', rules: { validate: urlValidator } });

  const isDisabled = formState.isSubmitting;

  return (
    <FormControl variant="floating" isDisabled={ isDisabled } size={{ base: 'md', lg: 'lg' }}>
      <Input
        { ...field }
        isInvalid={ Boolean(fieldState.error) }
        isDisabled={ isDisabled }
        autoComplete="off"
      />
      <InputPlaceholder text="Company website" error={ fieldState.error }/>
    </FormControl>
  );
};

export default React.memo(PublicTagsSubmitFieldCompanyWebsite);
