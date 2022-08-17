import {
  Input,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps, FieldValues } from 'react-hook-form';

const HASH_LENGTH = 66;

type Props<Field> = {
  field: Field;
  isInvalid: boolean;
  backgroundColor?: string;
}

function AddressInput<Field extends Partial<ControllerRenderProps<FieldValues, 'transaction'>>>({ field, isInvalid, backgroundColor }: Props<Field>) {
  return (
    <FormControl variant="floating" id="transaction" isRequired backgroundColor={ backgroundColor }>
      <Input
        { ...field }
        isInvalid={ isInvalid }
        maxLength={ HASH_LENGTH }
      />
      <FormLabel>Transaction hash (0x...)</FormLabel>
    </FormControl>
  );
}

export default AddressInput;
