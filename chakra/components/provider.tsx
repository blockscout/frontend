'use client';

import { ChakraProvider } from '@chakra-ui/react';

import theme from 'chakra/theme/theme';

import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from './color-mode';

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={ theme }>
      <ColorModeProvider { ...props }/>
    </ChakraProvider>
  );
}
