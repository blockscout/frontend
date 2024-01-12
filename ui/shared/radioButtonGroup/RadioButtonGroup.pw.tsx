import { Box } from '@chakra-ui/react';
import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';

import RadioButtonGroupTest from './specs/RadioButtonGroupTest';

test('radio button group', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <Box w="400px" p="10px">
        <RadioButtonGroupTest/>
      </Box>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
