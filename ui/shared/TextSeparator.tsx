import { chakra } from '@chakra-ui/react';
import type { StyleProps } from '@chakra-ui/styled-system';
import React from 'react';

const TextSeparator = (props: StyleProps) => {
  return <chakra.span mx={ 3 } { ...props }>|</chakra.span>;
};

export default React.memo(TextSeparator);
