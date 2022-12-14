import type { InputProps } from '@chakra-ui/react';
import {
  Input,
  FormControl,
} from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps, FieldError, FieldValues, Path } from 'react-hook-form';

import { ADDRESS_LENGTH } from 'lib/validations/address';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

type Props<TInputs extends FieldValues, TInputName extends Path<TInputs>> = {
  field: ControllerRenderProps<TInputs, TInputName>;
  size?: InputProps['size'];
  placeholder?: string;
  backgroundColor?: string;
  error?: FieldError;
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
      />
      <InputPlaceholder text={ placeholder } error={ error }/>
    </FormControl>
  );
}
