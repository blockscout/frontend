import {
  Input,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps, FieldError, FieldValues, Path } from 'react-hook-form';

import getPlaceholderWithError from 'lib/getPlaceholderWithError';

const TAG_MAX_LENGTH = 35;

type Props<TInputs extends FieldValues, TInputName extends Path<TInputs>> = {
  field: ControllerRenderProps<TInputs, TInputName>;
  error?: FieldError;
  backgroundColor?: string;
}

function TagInput<Inputs extends FieldValues, Name extends Path<Inputs>>({ field, error, backgroundColor }: Props<Inputs, Name>) {
  return (
    <FormControl variant="floating" id="tag" isRequired backgroundColor={ backgroundColor }>
      <Input
        { ...field }
        isInvalid={ Boolean(error) }
        maxLength={ TAG_MAX_LENGTH }
      />
      <FormLabel>{ getPlaceholderWithError(`Private tag (max 35 characters)`, error?.message) }</FormLabel>
    </FormControl>
  );
}

export default TagInput;
