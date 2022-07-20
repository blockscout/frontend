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
  size?: string;
  placeholder?: string;
}

const AddressInput: React.FC<Props> = ({ field, isInvalid, size, placeholder = 'Address (0x...)' }) => {
  return (
    <FormControl variant="floating" id="address" isRequired>
      <Input
        { ...field }
        placeholder=" "
        isInvalid={ isInvalid }
        maxLength={ ADDRESS_LENGTH }
        size={ size }
      />
      <FormLabel>{ placeholder }</FormLabel>
    </FormControl>
  )
}

export default AddressInput
