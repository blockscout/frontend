import {
  Input,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';

import { ADDRESS_LENGTH } from 'lib/addressValidations';

type Props<TInputs extends FieldValues, TInputName extends Path<TInputs>> = {
  field: ControllerRenderProps<TInputs, TInputName>;
  isInvalid: boolean;
  size?: string;
  placeholder?: string;
  backgroundColor?: string;
}

export default function AddressInput<Inputs extends FieldValues, Name extends Path<Inputs>>(
  {
    field,
    isInvalid,
    size,
    placeholder = 'Address (0x...)',
    backgroundColor,
  }: Props<Inputs, Name>) {
  return (
    <FormControl variant="floating" id="address" isRequired backgroundColor={ backgroundColor } size={ size }>
      <Input
        { ...field }
        isInvalid={ isInvalid }
        maxLength={ ADDRESS_LENGTH }
        size={ size }
      />
      <FormLabel>{ placeholder }</FormLabel>
    </FormControl>
  );
}
