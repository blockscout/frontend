import {
  Checkbox,
} from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';

type Props<TInputs extends FieldValues, TInputName extends Path<TInputs>> = {
  field: ControllerRenderProps<TInputs, TInputName>;
  text: string;
}

export default function CheckboxInput<Inputs extends FieldValues, Name extends Path<Inputs>>(
  {
    field,
    text,
  }: Props<Inputs, Name>) {
  return (
    <Checkbox
      isChecked={ field.value }
      onChange={ field.onChange }
      ref={ field.ref }
      colorScheme="blue"
      size="lg"
    >
      { text }
    </Checkbox>
  );
}
