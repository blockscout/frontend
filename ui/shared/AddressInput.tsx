import React from 'react'
import type { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';

import {
  Input,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';

const ADDRESS_LENGTH = 42;

type Props<TInputs extends FieldValues, TInputName extends Path<TInputs>> = {
  field: ControllerRenderProps<TInputs, TInputName>;
  isInvalid: boolean;
  size?: string;
  placeholder?: string;
}

export default function AddressInput<Inputs extends FieldValues, Name extends Path<Inputs>>(
  {
    field,
    isInvalid,
    size,
    placeholder = 'Address (0x...)',
  }: Props<Inputs, Name>) {
  return (
    <FormControl variant="floating" id="address" isRequired>
      <Input
        { ...field }
        isInvalid={ isInvalid }
        maxLength={ ADDRESS_LENGTH }
        size={ size }
      />
      <FormLabel>{ placeholder }</FormLabel>
    </FormControl>
  )
}
