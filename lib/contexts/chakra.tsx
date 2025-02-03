import {
  ChakraProvider as ChakraProviderDefault,
} from '@chakra-ui/react';
import type { ChakraProviderProps } from '@chakra-ui/react';
import React from 'react';

import theme from 'theme/theme';

export function ChakraProvider({ children }: ChakraProviderProps) {

  return (
    <ChakraProviderDefault theme={ theme }>
      { children }
    </ChakraProviderDefault>
  );
}
