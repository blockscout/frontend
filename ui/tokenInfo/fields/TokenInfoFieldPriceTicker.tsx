import { FormControl, Input } from '@chakra-ui/react';
import React from 'react';
import type { Control, ControllerRenderProps, FormState } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { Fields, TickerUrlFields } from '../types';

import { validator } from 'lib/validations/url';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

interface Props {
  formState: FormState<Fields>;
  control: Control<Fields>;
  isReadOnly?: boolean;
  name: keyof TickerUrlFields;
  label: string;
}

const TokenInfoFieldPriceTicker = ({ formState, control, isReadOnly, name, label }: Props) => {
  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<Fields, typeof name>}) => {
    const error = name in formState.errors ? formState.errors[name] : undefined;

    return (
      <FormControl variant="floating" id={ field.name } size="lg">
        <Input
          { ...field }
          isInvalid={ Boolean(error) }
          isDisabled={ formState.isSubmitting || isReadOnly }
          autoComplete="off"
        />
        <InputPlaceholder text={ label } error={ error }/>
      </FormControl>
    );
  }, [ formState.errors, formState.isSubmitting, isReadOnly, name, label ]);

  return (
    <Controller
      name={ name }
      control={ control }
      render={ renderControl }
      rules={{ validate: validator }}
    />
  );
};

export default React.memo(TokenInfoFieldPriceTicker);
