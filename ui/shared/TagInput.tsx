import React from 'react';

import type { ControllerRenderProps } from 'react-hook-form';

import {
  Input,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';

const TAG_MAX_LENGTH = 35;

type Props = {
  field: ControllerRenderProps<any, 'tag'>;
  isInvalid: boolean;
}

const TagInput: React.FC<Props> = ({ field, isInvalid }) => {
  return (
    <FormControl variant="floating" id="tag" isRequired>
      <Input
        { ...field }
        placeholder=" "
        isInvalid={ isInvalid }
        maxLength={ TAG_MAX_LENGTH }
      />
      <FormLabel>Private tag (max 35 characters)</FormLabel>
    </FormControl>
  )
}

export default TagInput;
