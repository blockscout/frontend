import { FormLabel, chakra } from '@chakra-ui/react';
import React from 'react';
import type { FieldError } from 'react-hook-form';

interface Props {
  text: string;
  error?: FieldError;
}

const InputPlaceholder = ({ text, error }: Props) => {
  let errorMessage = error?.message;

  if (!errorMessage && error?.type === 'pattern') {
    errorMessage = 'Invalid format';
  }

  return (
    <FormLabel>
      <chakra.span>{ text }</chakra.span>
      { errorMessage && <chakra.span order={ 3 } whiteSpace="pre"> - { errorMessage }</chakra.span> }
    </FormLabel>
  );
};

export default InputPlaceholder;
