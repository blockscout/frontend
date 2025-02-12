import {
  ChakraProvider as ChakraProviderDefault,
  cookieStorageManagerSSR,
  localStorageManager,
} from '@chakra-ui/react';
import type { ChakraProviderProps } from '@chakra-ui/react';
import React from 'react';

import theme from 'theme/theme';

interface Props extends ChakraProviderProps {
  cookies?: string;
}

export function ChakraProvider({ cookies, children }: Props) {
  const colorModeManager =
      typeof cookies === 'string' ?
        cookieStorageManagerSSR(typeof document !== 'undefined' ? document.cookie : cookies) :
        localStorageManager;

  return (
    <ChakraProviderDefault colorModeManager={ colorModeManager } theme={ theme }>
      { children }
    </ChakraProviderDefault>
  );
}
