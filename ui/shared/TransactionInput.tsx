import React from 'react';
import type { ControllerRenderProps, FieldValues } from 'react-hook-form';

import {
  Input,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';

const HASH_LENGTH = 66;

type Props = {
  field: ControllerRenderProps<FieldValues, 'transaction'>;
  isInvalid: boolean;
}

const AddressInput: React.FC<Props> = ({ field, isInvalid }) => {
  return (
    <FormControl variant="floating" id="transaction" isRequired>
      <Input
        { ...field }
        isInvalid={ isInvalid }
        maxLength={ HASH_LENGTH }
      />
      <FormLabel>Transaction hash (0x...)</FormLabel>
    </FormControl>
  );
};

export default AddressInput;
