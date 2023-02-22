import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import { outputRootsData } from 'mocks/outputRoots/outputRoots';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import OutputRoots from './OutputRoots';

const OUTPUT_ROOTS_API_URL = buildApiUrl('output_roots');

test('base view +@dark-mode', async({ mount, page }) => {
  await page.route('https://request-global.czilladx.com/serve/native.php?z=19260bf627546ab7242', (route) => route.fulfill({
    status: 200,
    body: '',
  }));

  await page.route(OUTPUT_ROOTS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(outputRootsData),
  }));

  const component = await mount(
    <TestApp>
      <OutputRoots/>
    </TestApp>,
  );

  await expect(component.locator('main')).toHaveScreenshot();
});
