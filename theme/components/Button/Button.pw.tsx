import { Button } from '@chakra-ui/react';
import React from 'react';

import { test, expect } from 'playwright/lib';

[
  { variant: 'solid' },
  { variant: 'solid', colorScheme: 'gray', withDarkMode: true },
  { variant: 'outline', colorScheme: 'gray', withDarkMode: true },
  { variant: 'outline', colorScheme: 'gray-dark', withDarkMode: true },
  { variant: 'outline', colorScheme: 'blue', withDarkMode: true },
  { variant: 'simple', withDarkMode: true },
  { variant: 'ghost', withDarkMode: true },
  { variant: 'subtle' },
  { variant: 'subtle', colorScheme: 'gray', withDarkMode: true },
].forEach(({ variant, colorScheme, withDarkMode }) => {
  test.describe(`variant ${ variant }${ colorScheme ? ` with ${ colorScheme } color scheme` : '' }${ withDarkMode ? ' +@dark-mode' : '' }`, () => {
    test('base', async({ render }) => {
      const component = await render(<Button variant={ variant } colorScheme={ colorScheme }>Click me</Button>);
      await expect(component.locator('button')).toHaveScreenshot();
    });

    test('disabled', async({ render }) => {
      const component = await render(<Button variant={ variant } colorScheme={ colorScheme } isDisabled>Click me</Button>);
      await expect(component.locator('button')).toHaveScreenshot();
    });

    test('hovered', async({ render }) => {
      const component = await render(<Button variant={ variant } colorScheme={ colorScheme }>Click me</Button>);
      await component.getByText(/click/i).hover();
      await expect(component.locator('button')).toHaveScreenshot();
    });

    test('active', async({ render }) => {
      const component = await render(<Button variant={ variant } colorScheme={ colorScheme } isActive>Click me</Button>);
      await expect(component.locator('button')).toHaveScreenshot();
    });
  });
});
