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

const TokenInfoFieldDocs = ({ formState, control, isReadOnly }: Props) => {
  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<Fields, 'docs'>}) => {
    const error = 'docs' in formState.errors ? formState.errors.docs : undefined;

    return (
      <FormControl variant="floating" id={ field.name } size="lg">
        <Input
          { ...field }
          isInvalid={ Boolean(error) }
          isDisabled={ formState.isSubmitting || isReadOnly }
          autoComplete="off"
        />
        <InputPlaceholder text="Docs" error={ error }/>
      </FormControl>
    );
  }, [ formState.errors, formState.isSubmitting, isReadOnly ]);

  return (
    <Controller
      name="docs"
      control={ control }
      render={ renderControl }
      rules={{ validate: validator }}
    />
  );
};

export default React.memo(TokenInfoFieldDocs);
