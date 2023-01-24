import { FormLabel, chakra } from '@chakra-ui/react';
import React from 'react';
import type { FieldError } from 'react-hook-form';

interface Props {
  text: string;
  error?: Partial<FieldError>;
  className?: string;
  isActive?: boolean;
  isFancy?: boolean;
}

const InputPlaceholder = ({ text, error, className, isActive, isFancy }: Props) => {
  let errorMessage = error?.message;

  if (!errorMessage && error?.type === 'pattern') {
    errorMessage = 'Invalid format';
  }

  return (
    <FormLabel
      className={ className }
      { ...(isActive ? { 'data-active': true } : {}) }
      { ...(isFancy ? { 'data-fancy': true } : {}) }
    >
      <chakra.span>{ text }</chakra.span>
      { errorMessage && <chakra.span order={ 3 } whiteSpace="pre"> - { errorMessage }</chakra.span> }
    </FormLabel>
  );
};

export default chakra(InputPlaceholder);
