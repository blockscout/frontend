import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import type { ControllerRenderProps, FieldValues, Path, Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

const TEXT_INPUT_MAX_LENGTH = 255;

interface Props<TInputs extends FieldValues> {
  fieldName: Path<TInputs>;
  label: string;
  required?: boolean;
  control: Control<TInputs, object>;
  pattern?: RegExp;
  hasError?: boolean;
}

export default function PublicTagsFormInput<Inputs extends FieldValues>({
  label,
  control,
  required,
  fieldName,
  pattern,
  hasError,
}: Props<Inputs>) {
  const renderInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, typeof fieldName>}) => {
    return (
      <FormControl variant="floating" id={ field.name } isRequired={ required } size="lg">
        <Input
          { ...field }
          size="lg"
          required={ required }
          isInvalid={ hasError }
          maxLength={ TEXT_INPUT_MAX_LENGTH }
        />
        <FormLabel>{ label }</FormLabel>
      </FormControl>
    );
  }, [ label, required, hasError ]);
  return (
    <Controller
      name={ fieldName }
      control={ control }
      render={ renderInput }
      rules={{ pattern }}
    />
  );
}
