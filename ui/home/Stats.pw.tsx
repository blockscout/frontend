import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as statsMock from 'mocks/stats/index';
import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import TestApp from 'playwright/TestApp';

import Stats from './Stats';

const API_URL = '/node-api/home-stats';

test('all items +@mobile +@dark-mode +@desktop-xl', async({ mount, page }) => {
  await page.route(API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(statsMock.base),
  }));

  const component = await mount(
    <TestApp>
      <Stats/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test.describe('4 items', () => {
  const extendedTest = test.extend({
    context: contextWithEnvs([
      { name: 'NEXT_PUBLIC_HOMEPAGE_SHOW_AVG_BLOCK_TIME', value: 'false' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ]) as any,
  });

  extendedTest('default view +@mobile -@default', async({ mount, page }) => {
    await page.route(API_URL, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify(statsMock.base),
    }));

    const component = await mount(
      <TestApp>
        <Stats/>
      </TestApp>,
    );

    await expect(component).toHaveScreenshot();
  });
});

test.describe('3 items', () => {
  const extendedTest = test.extend({
    context: contextWithEnvs([
      { name: 'NEXT_PUBLIC_HOMEPAGE_SHOW_AVG_BLOCK_TIME', value: 'false' },
      { name: 'NEXT_PUBLIC_HOMEPAGE_SHOW_GAS_TRACKER', value: 'false' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ]) as any,
  });

  extendedTest('default view +@mobile -@default', async({ mount, page }) => {
    await page.route(API_URL, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify(statsMock.base),
    }));

    const component = await mount(
      <TestApp>
        <Stats/>
      </TestApp>,
    );

    await expect(component).toHaveScreenshot();
  });
});
