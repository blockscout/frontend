import { Box } from '@chakra-ui/react';
import type { Locator } from '@playwright/test';
import React from 'react';

import { test, expect } from 'playwright/lib';

import { Truncate } from './Truncate';

const VALUES_COUNT = 12;
const VALUES = Array.from(
  { length: VALUES_COUNT },
  (_, index) => `0x${ String(index).padStart(2, '0') }e0994c15b944d0b7141ca00a8850642fae90fb98a0978d9c452ec4ee5349fa77b5df2118ae8f12167a1daea345208b`,
);

const getCenter = async(locator: Locator): Promise<{ x: number; y: number }> => {
  const box = await locator.boundingBox();
  if (!box) {
    throw new Error('Sweep target is not visible');
  }
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
};

test('no end-truncated tooltip stays open after a fast pointer sweep', async({ render, page }) => {
  await render(
    <Box p={ 10 } display="flex" gap={ 10 }>
      <Box w="100px" display="flex" flexDir="column" gap={ 4 }>
        { VALUES.map((value) => <Truncate key={ value } value={ value } type="end" w="100%"/>) }
      </Box>
      <Box w="200px" h="600px" data-testid="away"/>
    </Box>,
  );

  const points = await Promise.all([ ...VALUES.map((value) => page.getByText(value)), page.getByTestId('away') ].map(getCenter));

  // Not hover(): its actionability checks take about half of the tooltip's openDelay per step, and a stuck tooltip
  // covering the next trigger makes it time out before the assertion below can report the stuck tooltips.
  for (const { x, y } of points) {
    await page.mouse.move(x, y);
  }

  await expect(page.getByRole('tooltip')).toHaveCount(0);
});

test('end-truncated tooltip opens on tap -@default +@mobile', async({ render, page }) => {
  await render(
    <Box w="100px">
      <Truncate value={ VALUES[0] } type="end" w="100%"/>
    </Box>,
  );

  await page.getByText(VALUES[0]).tap();

  await expect(page.getByRole('tooltip')).toBeVisible();
});
