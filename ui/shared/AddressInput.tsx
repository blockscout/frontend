import {
  Input,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';

import getPlaceholderWithError from 'lib/getPlaceholderWithError';
import { ADDRESS_LENGTH } from 'lib/validations/address';

type Props<TInputs extends FieldValues, TInputName extends Path<TInputs>> = {
  field: ControllerRenderProps<TInputs, TInputName>;
  size?: string;
  placeholder?: string;
  backgroundColor?: string;
  error?: string;
}

export default function AddressInput<Inputs extends FieldValues, Name extends Path<Inputs>>(
  {
    error,
    field,
    size,
    placeholder = 'Address (0x...)',
    backgroundColor,
  }: Props<Inputs, Name>) {
  return (
    <FormControl variant="floating" id="address" isRequired backgroundColor={ backgroundColor } size={ size }>
      <Input
        { ...field }
        isInvalid={ Boolean(error) }
        maxLength={ ADDRESS_LENGTH }
        size={ size }
      />
      <FormLabel>{ getPlaceholderWithError(placeholder, error) }</FormLabel>
    </FormControl>
  );
}
