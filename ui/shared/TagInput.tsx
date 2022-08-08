import {
  Input,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps, FieldValues } from 'react-hook-form';

const TAG_MAX_LENGTH = 35;

type Props<Field> = {
  field: Field;
  isInvalid: boolean;
}

function TagInput<Field extends Partial<ControllerRenderProps<FieldValues, 'tag'>>>({ field, isInvalid }: Props<Field>) {
  return (
    <FormControl variant="floating" id="tag" isRequired>
      <Input
        { ...field }
        isInvalid={ isInvalid }
        maxLength={ TAG_MAX_LENGTH }
      />
      <FormLabel>Private tag (max 35 characters)</FormLabel>
    </FormControl>
  );
}

export default TagInput;
