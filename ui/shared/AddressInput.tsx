import React from 'react'
import type { ControllerRenderProps } from 'react-hook-form';

import {
  Input,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';

const ADDRESS_LENGTH = 42;

type Props = {
  field: ControllerRenderProps<any, 'address'>;
  isInvalid: boolean;
}

const AddressInput: React.FC<Props> = ({ field, isInvalid }) => {
  return (
    <FormControl variant="floating" id="address" isRequired>
      <Input
        { ...field }
        placeholder=" "
        isInvalid={ isInvalid }
        maxLength={ ADDRESS_LENGTH }
      />
      <FormLabel>Address (0x...)</FormLabel>
    </FormControl>
  )
}

export default AddressInput
