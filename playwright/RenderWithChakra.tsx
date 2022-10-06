import { ChakraProvider } from '@chakra-ui/react';
import type { ColorMode } from '@chakra-ui/react';
import React from 'react';

import theme from '../theme';

type Props = {
  children: React.ReactNode;
  colorMode?: ColorMode;
}

const RenderWithChakra = ({ children, colorMode = 'light' }: Props) => {
  return (
    <ChakraProvider theme={{ ...theme, config: { ...theme.config, initialColorMode: colorMode } }}>
      { children }
    </ChakraProvider>
  );
};

export default RenderWithChakra;
