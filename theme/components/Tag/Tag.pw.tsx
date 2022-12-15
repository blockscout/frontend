import { Box, Tag } from '@chakra-ui/react';
import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';

[ 'blue', 'gray', 'orange', 'green', 'purple', 'cyan', 'teal' ].forEach((colorScheme) => {
  test(`${ colorScheme } color scheme +@dark-mode`, async({ mount }) => {
    const component = await mount(
      <TestApp>
        <Tag colorScheme={ colorScheme }>content</Tag>
      </TestApp>,
    );

    await expect(component.getByText(/content/i)).toHaveScreenshot();
  });
});

test('with long text', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <Box w="100px">
        <Tag>this is very looooooooooong text</Tag>
      </Box>
    </TestApp>,
  );

  await expect(component.getByText(/this/i)).toHaveScreenshot();
});
