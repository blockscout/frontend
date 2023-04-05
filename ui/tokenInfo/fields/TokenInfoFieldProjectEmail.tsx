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

const TokenInfoFieldProjectEmail = ({ formState, control, isReadOnly }: Props) => {
  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<Fields, 'project_email'>}) => {
    const error = 'project_email' in formState.errors ? formState.errors.project_email : undefined;

    return (
      <FormControl variant="floating" id={ field.name } isRequired size="lg">
        <Input
          { ...field }
          required
          isInvalid={ Boolean(error) }
          isDisabled={ formState.isSubmitting || isReadOnly }
          autoComplete="off"
        />
        <InputPlaceholder text="Official project email address" error={ error }/>
      </FormControl>
    );
  }, [ formState.errors, formState.isSubmitting, isReadOnly ]);

  return (
    <Controller
      name="project_email"
      control={ control }
      render={ renderControl }
      rules={{ required: true, pattern: EMAIL_REGEXP }}
    />
  );
};

export default React.memo(TokenInfoFieldProjectEmail);
