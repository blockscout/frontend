import { FormLabel, chakra } from '@chakra-ui/react';
import React from 'react';
import type { FieldError } from 'react-hook-form';

interface Props {
  text: string;
  icon?: React.ReactNode;
  error?: Partial<FieldError>;
  className?: string;
  isFancy?: boolean;
  isInModal?: boolean;
}

const InputPlaceholder = ({ text, icon, error, className, isFancy, isInModal }: Props) => {
  let errorMessage = error?.message;

  if (!errorMessage && error?.type === 'pattern') {
    errorMessage = 'Invalid format';
  }

  return (
    <FormLabel
      className={ className }
      alignItems="center"
      { ...(isFancy ? { 'data-fancy': true } : {}) }
      { ...(isInModal ? { 'data-in-modal': true } : {}) }
    >
      { icon }
      <chakra.span>{ text }</chakra.span>
      { errorMessage && <chakra.span order={ 3 } whiteSpace="pre"> - { errorMessage }</chakra.span> }
    </FormLabel>
  );
};

export default chakra(InputPlaceholder);
