import {
  Input,
  FormControl,
} from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps, FieldError, FieldValues } from 'react-hook-form';

import { TRANSACTION_HASH_LENGTH } from 'lib/validations/transaction';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

type Props<Field> = {
  field: Field;
  error?: FieldError;
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
      <InputPlaceholder text="Transaction hash (0x...)" error={ error }/>
    </FormControl>
  );
}

export default TransactionInput;
