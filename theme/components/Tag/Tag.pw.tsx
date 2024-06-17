import { Box, Tag } from '@chakra-ui/react';
import React from 'react';

import { test, expect } from 'playwright/lib';

[ 'blue', 'gray', 'gray-blue', 'orange', 'green', 'purple', 'cyan', 'teal' ].forEach((colorScheme) => {
  test(`${ colorScheme } color scheme +@dark-mode`, async({ render }) => {
    const component = await render(<Tag colorScheme={ colorScheme }>content</Tag>);
    await expect(component.getByText(/content/i)).toHaveScreenshot();
  });
});

test('with long text', async({ render }) => {
  const component = await render(
    <Box w="100px">
      <Tag>this is very looooooooooong text</Tag>
    </Box>,
  );
  await expect(component.getByText(/this/i)).toHaveScreenshot();
});
