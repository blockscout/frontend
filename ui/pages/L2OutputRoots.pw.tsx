import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import { outputRootsData } from 'mocks/l2outputRoots/outputRoots';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import OutputRoots from './L2OutputRoots';

const OUTPUT_ROOTS_API_URL = buildApiUrl('l2_output_roots');
const OUTPUT_ROOTS_COUNT_API_URL = buildApiUrl('l2_output_roots_count');

test('base view +@mobile', async({ mount, page }) => {
  await page.route('https://request-global.czilladx.com/serve/native.php?z=19260bf627546ab7242', (route) => route.fulfill({
    status: 200,
    body: '',
  }));

  await page.route(OUTPUT_ROOTS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(outputRootsData),
  }));

  await page.route(OUTPUT_ROOTS_COUNT_API_URL, (route) => route.fulfill({
    status: 200,
    body: '9927',
  }));

  const component = await mount(
    <TestApp>
      <OutputRoots/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
