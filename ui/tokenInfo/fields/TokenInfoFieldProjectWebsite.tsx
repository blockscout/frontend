import { FormControl, Input } from '@chakra-ui/react';
import React from 'react';
import type { Control, ControllerRenderProps, FormState } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { Fields } from '../types';

import { validator } from 'lib/validations/url';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

interface Props {
  formState: FormState<Fields>;
  control: Control<Fields>;
  isReadOnly?: boolean;
}

const TokenInfoFieldProjectWebsite = ({ formState, control, isReadOnly }: Props) => {
  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<Fields, 'project_website'>}) => {
    const error = 'project_website' in formState.errors ? formState.errors.project_website : undefined;

    return (
      <FormControl variant="floating" id={ field.name } size="lg" isRequired>
        <Input
          { ...field }
          isInvalid={ Boolean(error) }
          isDisabled={ formState.isSubmitting || isReadOnly }
          autoComplete="off"
          required
        />
        <InputPlaceholder text="Official project website" error={ error }/>
      </FormControl>
    );
  }, [ formState.errors, formState.isSubmitting, isReadOnly ]);

  return (
    <Controller
      name="project_website"
      control={ control }
      render={ renderControl }
      rules={{ required: true, validate: validator }}
    />
  );
};

export default React.memo(TokenInfoFieldProjectWebsite);
