import React, { useCallback } from 'react';
import type { ControllerRenderProps, FieldValues, Path, Control } from 'react-hook-form';
import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

interface Props<TInputs extends FieldValues> {
  fieldName: Path<TInputs>;
  label: string;
  required?: boolean;
  control: Control<TInputs, object>;
}

export default function PublicTagsFormInput<Inputs extends FieldValues>({ label, control, required, fieldName }: Props<Inputs>) {
  const renderInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, typeof fieldName>}) => {
    return (
      <FormControl variant="floating" id={ field.name } isRequired={ required }>
        <Input
          { ...field }
          size="lg"
          required={ required }
        />
        <FormLabel>{ label }</FormLabel>
      </FormControl>
    )
  }, [ label, required ]);
  return (
    <Controller
      name={ fieldName }
      control={ control }
      render={ renderInput }
    />
  )
}
