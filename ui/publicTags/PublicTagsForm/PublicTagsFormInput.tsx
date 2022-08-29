import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import type { ControllerRenderProps, FieldValues, Path, Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import getPlaceholderWithError from 'lib/getPlaceholderWithError';

const TEXT_INPUT_MAX_LENGTH = 255;

interface Props<TInputs extends FieldValues> {
  fieldName: Path<TInputs>;
  label: string;
  required?: boolean;
  control: Control<TInputs, object>;
  pattern?: RegExp;
  error?: string;
}

export default function PublicTagsFormInput<Inputs extends FieldValues>({
  label,
  control,
  required,
  fieldName,
  pattern,
  error,
}: Props<Inputs>) {
  const renderInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, typeof fieldName>}) => {
    return (
      <FormControl variant="floating" id={ field.name } isRequired={ required } size="lg">
        <Input
          { ...field }
          size="lg"
          required={ required }
          isInvalid={ Boolean(error) }
          maxLength={ TEXT_INPUT_MAX_LENGTH }
        />
        <FormLabel>{ getPlaceholderWithError(label, error) }</FormLabel>
      </FormControl>
    );
  }, [ label, required, error ]);
  return (
    <Controller
      name={ fieldName }
      control={ control }
      render={ renderInput }
      rules={{ pattern }}
    />
  );
}
