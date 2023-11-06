import { test as base, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import { outputRootsData } from 'mocks/l2outputRoots/outputRoots';
import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';
import * as configs from 'playwright/utils/configs';

import OutputRoots from './L2OutputRoots';

const test = base.extend({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: contextWithEnvs(configs.featureEnvs.optimisticRollup) as any,
});

const OUTPUT_ROOTS_API_URL = buildApiUrl('l2_output_roots');
const OUTPUT_ROOTS_COUNT_API_URL = buildApiUrl('l2_output_roots_count');

test('base view +@mobile', async({ mount, page }) => {
  // test on mobile is flaky
  // my assumption is there is not enough time to calculate hashes truncation so component is unstable
  // so I raised the test timeout to check if it helps
  test.slow();

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

  await expect(component).toHaveScreenshot({ timeout: 10_000 });
});
