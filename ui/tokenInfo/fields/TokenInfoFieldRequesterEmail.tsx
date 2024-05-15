import { FormControl, Input } from '@chakra-ui/react';
import React from 'react';
import type { Control, ControllerProps } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { Fields } from '../types';

import { EMAIL_REGEXP } from 'lib/validations/email';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

interface Props {
  control: Control<Fields>;
  isReadOnly?: boolean;
}

const TokenInfoFieldRequesterEmail = ({ control, isReadOnly }: Props) => {
  const renderControl: ControllerProps<Fields, 'requester_email'>['render'] = React.useCallback(({ field, fieldState, formState }) => {
    return (
      <FormControl variant="floating" id={ field.name } isRequired size={{ base: 'md', lg: 'lg' }}>
        <Input
          { ...field }
          required
          isInvalid={ Boolean(fieldState.error) }
          isDisabled={ formState.isSubmitting }
          isReadOnly={ isReadOnly }
          autoComplete="off"
        />
        <InputPlaceholder text="Requester email" error={ fieldState.error }/>
      </FormControl>
    );
  }, [ isReadOnly ]);

  return (
    <Controller
      name="requester_email"
      control={ control }
      render={ renderControl }
      rules={{ required: true, pattern: EMAIL_REGEXP }}
    />
  );
};

export default React.memo(TokenInfoFieldRequesterEmail);
