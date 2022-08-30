import {
  Input,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps, FieldValues } from 'react-hook-form';

import getPlaceholderWithError from 'lib/getPlaceholderWithError';
import { TRANSACTION_HASH_LENGTH } from 'lib/validations/transaction';

type Props<Field> = {
  field: Field;
  error?: string;
  backgroundColor?: string;
}

function TransactionInput<Field extends Partial<ControllerRenderProps<FieldValues, 'transaction'>>>({ field, error, backgroundColor }: Props<Field>) {
  return (
    <FormControl variant="floating" id="transaction" isRequired backgroundColor={ backgroundColor }>
      <Input
        { ...field }
        isInvalid={ Boolean(error) }
        maxLength={ TRANSACTION_HASH_LENGTH }
      />
      <FormLabel>{ getPlaceholderWithError('Transaction hash (0x...)', error) }</FormLabel>
    </FormControl>
  );
}

export default TransactionInput;
