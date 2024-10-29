import { FormLabel, chakra } from '@chakra-ui/react';
import React from 'react';
import type { FieldError } from 'react-hook-form';

interface Props {
  text: string;
  icon?: React.ReactNode;
  error?: Partial<FieldError>;
  isFancy?: boolean;
}

const InputPlaceholder = ({ text, icon, error, isFancy }: Props) => {
  let errorMessage = error?.message;

  if (!errorMessage && error?.type === 'pattern') {
    errorMessage = 'Invalid format';
  }

  return (
    <FormLabel
      alignItems="center"
      { ...(isFancy ? { 'data-fancy': true } : {}) }
      variant="floating"
      bgColor="deeppink"
    >
      { icon }
      <chakra.span>{ text }</chakra.span>
      { errorMessage && <chakra.span order={ 3 } whiteSpace="pre"> - { errorMessage }</chakra.span> }
    </FormLabel>
  );
};

export default React.memo(InputPlaceholder);
