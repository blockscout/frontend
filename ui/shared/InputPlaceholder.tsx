import { FormLabel, chakra } from '@chakra-ui/react';
import React from 'react';

interface Props {
  text: string;
  error?: string;
}

const InputPlaceholder = ({ text, error }: Props) => {
  return (
    <FormLabel>
      <chakra.span>{ text }</chakra.span>
      { error && <chakra.span order={ 3 } whiteSpace="pre"> - { error }</chakra.span> }
    </FormLabel>
  );
};

export default InputPlaceholder;
