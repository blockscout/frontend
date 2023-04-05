import { FormControl, Input } from '@chakra-ui/react';
import React from 'react';
import type { Control, ControllerRenderProps, FormState } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { Fields } from '../types';

import { EMAIL_REGEXP } from 'lib/validations/email';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

interface Props {
  formState: FormState<Fields>;
  control: Control<Fields>;
  isReadOnly?: boolean;
}

const TokenInfoFieldRequesterEmail = ({ formState, control, isReadOnly }: Props) => {
  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<Fields, 'requester_email'>}) => {
    const error = 'requester_email' in formState.errors ? formState.errors.requester_email : undefined;

    return (
      <FormControl variant="floating" id={ field.name } isRequired size="lg">
        <Input
          { ...field }
          required
          isInvalid={ Boolean(error) }
          isDisabled={ formState.isSubmitting || isReadOnly }
          autoComplete="off"
        />
        <InputPlaceholder text="Requester email" error={ error }/>
      </FormControl>
    );
  }, [ formState.errors, formState.isSubmitting, isReadOnly ]);

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
