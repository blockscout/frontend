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
        // TODO: move this to input theme
        css={{
          ':-webkit-autofill': { transition: 'background-color 5000s ease-in-out 0s' },
          ':-webkit-autofill:hover': { transition: 'background-color 5000s ease-in-out 0s' },
          ':-webkit-autofill:focus': { transition: 'background-color 5000s ease-in-out 0s' },
        }}
      />
      <FormLabel>Address (0x...)</FormLabel>
    </FormControl>
  )
}

export default AddressInput
