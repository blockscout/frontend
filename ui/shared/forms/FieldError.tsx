import { Box, chakra } from '@chakra-ui/react';
import React from 'react';

interface Props {
  message: string;
  className?: string;
}

const FieldError = ({ message, className }: Props) => {
  return <Box className={ className } color="error" fontSize="sm" mt={ 2 } wordBreak="break-word">{ message }</Box>;
};

export default chakra(FieldError);
