import { Box, Tooltip, Icon } from '@chakra-ui/react';
import React from 'react';

import { test, expect } from 'playwright/lib';

test('base view +@dark-mode', async({ render, page }) => {
  const component = await render(
    <Box m={ 10 }>
      <Tooltip label="Tooltip content">
          trigger
      </Tooltip>
    </Box>,
  );

  await component.getByText(/trigger/i).hover();

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 40, width: 130, height: 64 } });
});

// was not able to reproduce in tests issue when Icon is used as trigger for tooltip
// https://github.com/chakra-ui/chakra-ui/issues/7107
test.fixme('with icon', async({ render, page }) => {
  const component = await render(
    <Box m={ 10 }>
      <Tooltip label="Tooltip content">
        <Icon viewBox="0 0 20 20" boxSize={ 5 } aria-label="Trigger">
          <circle cx="10" cy="10" r="10"/>
        </Icon>
      </Tooltip>
    </Box>,
  );

  const tooltip = page.getByText(/tooltip content/i);
  expect(await tooltip.isVisible()).toBe(false);

  await component.locator('svg[aria-label="Trigger"]').hover();
  expect(await tooltip.isVisible()).toBe(true);
});
