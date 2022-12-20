import { Box, Tooltip, Icon } from '@chakra-ui/react';
import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';

test('base view +@dark-mode', async({ mount, page }) => {
  const component = await mount(
    <TestApp>
      <Box m={ 10 }>
        <Tooltip label="Tooltip content">
          trigger
        </Tooltip>
      </Box>
    </TestApp>,
  );

  await component.getByText(/trigger/i).hover();

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 40, width: 130, height: 64 } });
});

// was not able to reproduce in tests issue when Icon is used as trigger for tooltip
// https://github.com/chakra-ui/chakra-ui/issues/7107
test.skip('with icon', async({ mount, page }) => {
  const component = await mount(
    <TestApp>
      <Box m={ 10 }>
        <Tooltip label="Tooltip content">
          <Icon viewBox="0 0 20 20" boxSize={ 5 } aria-label="Trigger">
            <circle cx="10" cy="10" r="10"/>
          </Icon>
        </Tooltip>
      </Box>
    </TestApp>,
  );

  const tooltip = page.getByText(/tooltip content/i);
  expect(await tooltip.isVisible()).toBe(false);

  await component.locator('svg[aria-label="Trigger"]').hover();
  expect(await tooltip.isVisible()).toBe(true);
});
