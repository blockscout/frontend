import {
  Checkbox,
} from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';

type Props<TInputs extends FieldValues, TInputName extends Path<TInputs>> = {
  field: ControllerRenderProps<TInputs, TInputName>;
  text: string;
  onChange?: () => void;
}

export default function CheckboxInput<Inputs extends FieldValues, Name extends Path<Inputs>>(
  {
    field,
    text,
    onChange,
  }: Props<Inputs, Name>) {

  const handleChange: typeof field.onChange = React.useCallback((...args) => {
    field.onChange(...args);
    onChange?.();
  }, [ field, onChange ]);

  return (
    <Checkbox
      isChecked={ field.value }
      onChange={ handleChange }
      ref={ field.ref }
      colorScheme="blue"
      size="lg"
    >
      { text }
    </Checkbox>
  );
}
