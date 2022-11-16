import React from 'react';
import theme from 'theme';
import { ChakraProvider } from '@chakra-ui/react';

export const decorators = [
  (Story) => (
    <ChakraProvider theme={ theme }>
      <Story />
    </ChakraProvider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}