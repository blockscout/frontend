import { test, expect } from '@playwright/experimental-ct-react';
import type { Locator } from '@playwright/test';
import React from 'react';

import * as statsMock from 'mocks/stats/index';
import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';
import * as configs from 'playwright/utils/configs';

import Stats from './Stats';

const API_URL = buildApiUrl('homepage_stats');

test.describe('all items', () => {
  let component: Locator;

  test.beforeEach(async({ page, mount }) => {
    await page.route(API_URL, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify(statsMock.withBtcLocked),
    }));

    component = await mount(
      <TestApp>
        <Stats/>
      </TestApp>,
    );
  });

  test('+@mobile +@dark-mode', async() => {
    await expect(component).toHaveScreenshot();
  });

  test.describe('screen xl', () => {
    test.use({ viewport: configs.viewport.xl });

    test('', async() => {
      await expect(component).toHaveScreenshot();
    });
  });
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
