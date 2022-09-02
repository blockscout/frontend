import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import type { ControllerRenderProps, FieldError, FieldValues, Path, Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import getPlaceholderWithError from 'lib/getPlaceholderWithError';

const TEXT_INPUT_MAX_LENGTH = 255;

interface Props<TInputs extends FieldValues> {
  fieldName: Path<TInputs>;
  label: string;
  required?: boolean;
  control: Control<TInputs, object>;
  pattern?: RegExp;
  error?: FieldError;
  size?: string;
}

export default function PublicTagsFormInput<Inputs extends FieldValues>({
  label,
  control,
  required,
  fieldName,
  pattern,
  error,
  size,
}: Props<Inputs>) {
  const renderInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, typeof fieldName>}) => {
    return (
      <FormControl variant="floating" id={ field.name } isRequired={ required } size={ size }>
        <Input
          { ...field }
          size={ size }
          required={ required }
          isInvalid={ Boolean(error) }
          maxLength={ TEXT_INPUT_MAX_LENGTH }
        />
        <FormLabel>{ getPlaceholderWithError(label, error?.message) }</FormLabel>
      </FormControl>
    );
  }, [ label, required, error, size ]);
  return (
    <Controller
      name={ fieldName }
      control={ control }
      render={ renderInput }
      rules={{ pattern }}
    />
  );
}
