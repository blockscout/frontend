import type { HTMLChakraProps } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/react';
import React from 'react';

const TextSeparator = ({ id, ...props }: HTMLChakraProps<'span'> & { id?: string }) => {
  return <chakra.span mx={ 3 } id={ id } { ...props }>|</chakra.span>;
};

export default React.memo(TextSeparator);
