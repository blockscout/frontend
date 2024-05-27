import { Box } from '@chakra-ui/react';
import React from 'react';

import { test, expect } from 'playwright/lib';

import RadioButtonGroupTest from './specs/RadioButtonGroupTest';

test('radio button group', async({ render }) => {
  const component = await render(
    <Box w="400px" p="10px">
      <RadioButtonGroupTest/>
    </Box>,
  );
  await expect(component).toHaveScreenshot();
});
