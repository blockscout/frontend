import {
  ChakraProvider as ChakraProviderDefault,
  cookieStorageManagerSSR,
  localStorageManager,
} from '@chakra-ui/react';
import type { ChakraProviderProps } from '@chakra-ui/react';
import { CacheProvider } from '@emotion/react';
import React from 'react';

import createEmotionCache from 'lib/createEmotionCache';
import theme from 'theme/theme';

// Create the emotion cache
const emotionCache = createEmotionCache();

interface Props extends ChakraProviderProps {
  cookies?: string;
}

export function ChakraProvider({
  cookies,
  children,
}: Props) {
  const cache = emotionCache;

  const colorModeManager =
      typeof cookies === 'string' ?
        cookieStorageManagerSSR(typeof document !== 'undefined' ? document.cookie : cookies) :
        localStorageManager;

  return (
    <CacheProvider value={ cache }>
      <ChakraProviderDefault colorModeManager={ colorModeManager } theme={ theme }>
        { children }
      </ChakraProviderDefault>
    </CacheProvider>
  );
}
