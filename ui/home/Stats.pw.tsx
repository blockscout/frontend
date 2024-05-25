import type { Locator } from '@playwright/test';
import React from 'react';

import * as statsMock from 'mocks/stats/index';
import { test, expect } from 'playwright/lib';
import * as pwConfig from 'playwright/utils/config';

import Stats from './Stats';

test.describe('all items', () => {
  let component: Locator;

  test.beforeEach(async({ render, mockApiResponse }) => {
    await mockApiResponse('stats', statsMock.withBtcLocked);
    component = await render(<Stats/>);
  });

  test('+@mobile +@dark-mode', async() => {
    await expect(component).toHaveScreenshot();
  });

  test.describe('screen xl', () => {
    test.use({ viewport: pwConfig.viewport.xl });

    test('', async() => {
      await expect(component).toHaveScreenshot();
    });
  });
});

test('4 items default view +@mobile -@default', async({ render, mockApiResponse, mockEnvs }) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_HOMEPAGE_SHOW_AVG_BLOCK_TIME', 'false' ],
  ]);
  await mockApiResponse('stats', statsMock.base);
  const component = await render(<Stats/>);
  await expect(component).toHaveScreenshot();
});

test('3 items default view +@mobile -@default', async({ render, mockApiResponse, mockEnvs }) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_HOMEPAGE_SHOW_AVG_BLOCK_TIME', 'false' ],
    [ 'NEXT_PUBLIC_GAS_TRACKER_ENABLED', 'false' ],
  ]);
  await mockApiResponse('stats', statsMock.base);
  const component = await render(<Stats/>);
  await expect(component).toHaveScreenshot();
});
