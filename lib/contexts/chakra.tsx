import {
  ChakraProvider as ChakraProviderDefault,
  cookieStorageManagerSSR,
  localStorageManager,
} from '@chakra-ui/react';
import type { ChakraProviderProps } from '@chakra-ui/react';
import React from 'react';

import { get, NAMES } from 'lib/cookies';
import theme from 'theme/theme';

interface Props extends ChakraProviderProps {
  cookies?: string;
}

export function ChakraProvider({ cookies, children }: Props) {
  // When a cookie header is present, cookieStorageManagerSSR looks for a "chakra-ui-color-mode" cookie.
  // If it doesn’t find one, it doesn’t consider theme’s initialColorMode. Instead, it is defaulting to light mode
  // So we need to use localStorageManager instead of cookieStorageManagerSSR to get the correct default color mode
  const colorModeManager =
    typeof cookies === 'string' && get(NAMES.COLOR_MODE, cookies) ?
      cookieStorageManagerSSR(typeof document !== 'undefined' ? document.cookie : cookies) :
      localStorageManager;

  return (
    <ChakraProviderDefault colorModeManager={ colorModeManager } theme={ theme }>
      { children }
    </ChakraProviderDefault>
  );
}
