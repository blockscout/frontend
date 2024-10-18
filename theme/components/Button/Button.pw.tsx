import { Box, Button, Flex } from '@chakra-ui/react';
import React from 'react';

import { test, expect } from 'playwright/lib';

test.use({ viewport: { width: 150, height: 350 } });

[
  { variant: 'solid', states: [ 'default', 'disabled', 'hovered', 'active' ] },
  { variant: 'outline', colorScheme: 'gray', withDarkMode: true, states: [ 'default', 'disabled', 'hovered', 'active', 'selected' ] },
  { variant: 'outline', colorScheme: 'blue', withDarkMode: true, states: [ 'default', 'disabled', 'hovered', 'active', 'selected' ] },
  { variant: 'simple', withDarkMode: true, states: [ 'default', 'hovered' ] },
  { variant: 'ghost', withDarkMode: true, states: [ 'default', 'hovered', 'active' ] },
  { variant: 'subtle', states: [ 'default', 'hovered' ] },
  { variant: 'subtle', colorScheme: 'gray', states: [ 'default', 'hovered' ], withDarkMode: true },
  { variant: 'hero', states: [ 'default', 'hovered' ], withDarkMode: true },
  { variant: 'header', states: [ 'default', 'hovered', 'selected' ], withDarkMode: true },
  { variant: 'radio_group', states: [ 'default', 'hovered', 'selected' ], withDarkMode: true },
].forEach(({ variant, colorScheme, withDarkMode, states }) => {
  test.describe(`variant ${ variant }${ colorScheme ? ` with ${ colorScheme } color scheme` : '' }${ withDarkMode ? ' +@dark-mode' : '' }`, () => {
    test('', async({ render }) => {
      const component = await render(
        <Flex p={ 2 } flexDir="column" rowGap={ 3 }>
          { states?.map((state) => {
            switch (state) {
              case 'default': {
                return (
                  <Box>
                    <Box color="text_secondary" fontSize="sm">Default:</Box>
                    <Button variant={ variant } colorScheme={ colorScheme }>Click me</Button>
                  </Box>
                );
              }
              case 'disabled': {
                return (
                  <Box>
                    <Box color="text_secondary" fontSize="sm">Disabled:</Box>
                    <Button variant={ variant } colorScheme={ colorScheme } isDisabled>Click me</Button>
                  </Box>
                );
              }
              case 'active': {
                return (
                  <Box>
                    <Box color="text_secondary" fontSize="sm">Active:</Box>
                    <Button variant={ variant } colorScheme={ colorScheme } isActive>Click me</Button>
                  </Box>
                );
              }
              case 'hovered': {
                return (
                  <Box>
                    <Box color="text_secondary" fontSize="sm">Hovered:</Box>
                    <Button variant={ variant } colorScheme={ colorScheme }>Hover me</Button>
                  </Box>
                );
              }
              case 'selected': {
                return (
                  <Box>
                    <Box color="text_secondary" fontSize="sm">Selected:</Box>
                    <Button variant={ variant } colorScheme={ colorScheme } data-selected="true">Click me</Button>
                  </Box>
                );
              }

              default: {
                return null;
              }
            }
          }) }
        </Flex>,
      );
      await component.getByText('Hover me').hover();
      await expect(component).toHaveScreenshot();
    });
  });
});
