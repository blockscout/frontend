import { FormControl, Textarea } from '@chakra-ui/react';
import React from 'react';
import { useController, useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';

import useIsMobile from 'lib/hooks/useIsMobile';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

const MAX_LENGTH = 80;

const PublicTagsSubmitFieldDescription = () => {
  const isMobile = useIsMobile();
  const { control } = useFormContext<FormFields>();
  const { field, fieldState, formState } = useController<FormFields, 'description'>({
    control,
    name: 'description',
    rules: { maxLength: MAX_LENGTH, required: true },
  });

  const isDisabled = formState.isSubmitting;

  return (
    <FormControl variant="floating" isDisabled={ isDisabled } isRequired size={{ base: 'md', lg: 'lg' }}>
      <Textarea
        { ...field }
        isInvalid={ Boolean(fieldState.error) }
        isDisabled={ isDisabled }
        autoComplete="off"
        maxH="160px"
        maxLength={ MAX_LENGTH }
      />
      <InputPlaceholder
        text={ isMobile ? 'Confirm the connection between addresses and tags.' : 'Provide a comment to confirm the connection between addresses and tags.' }
        error={ fieldState.error }
      />
    </FormControl>
  );
};

export default React.memo(PublicTagsSubmitFieldDescription);
