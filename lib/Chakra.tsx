import {
  ChakraProvider,
  cookieStorageManagerSSR,
  localStorageManager,
} from '@chakra-ui/react';
import type { ChakraProviderProps } from '@chakra-ui/react';
import React from 'react';

interface Props extends ChakraProviderProps {
  cookies?: string;
}

export function Chakra({ cookies, theme, children }: Props) {
  const colorModeManager =
      typeof cookies === 'string' ?
        cookieStorageManagerSSR(cookies) :
        localStorageManager;

  return (
    <ChakraProvider colorModeManager={ colorModeManager } theme={ theme }>
      { children }
    </ChakraProvider>
  );
}
