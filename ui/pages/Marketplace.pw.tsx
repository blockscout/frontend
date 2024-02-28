import { test as base, expect, devices } from '@playwright/experimental-ct-react';
import type { Page, Route } from '@playwright/test';
import React from 'react';

import { buildExternalAssetFilePath } from 'configs/app/utils';
import { apps as appsMock } from 'mocks/apps/apps';
import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import TestApp from 'playwright/TestApp';
import * as app from 'playwright/utils/app';

import Marketplace from './Marketplace';

const MARKETPLACE_CONFIG_URL = app.url + buildExternalAssetFilePath('NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', 'https://marketplace-config.json') || '';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const testFn = async({ mount, page }: { mount: any; page: Page }) => {
  await page.route(MARKETPLACE_CONFIG_URL, (route: Route) => route.fulfill({
    status: 200,
    body: JSON.stringify(appsMock),
  }));

  await Promise.all(appsMock.map(app =>
    page.route(app.logo, (route: Route) =>
      route.fulfill({
        status: 200,
        path: './playwright/mocks/image_s.jpg',
      }),
    ),
  ));

  const component = await mount(
    <TestApp>
      <Marketplace/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
};

let test = base.extend({
  context: contextWithEnvs([
    { name: 'NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', value: MARKETPLACE_CONFIG_URL },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ]) as any,
});

test('base view +@dark-mode', testFn);

test.describe('mobile', () => {
  test.use({ viewport: devices['iPhone 13 Pro'].viewport });

  test('base view', testFn);

  test = test.extend({
    context: contextWithEnvs([
      { name: 'NEXT_PUBLIC_MARKETPLACE_SUGGEST_IDEAS_FORM', value: '' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ]) as any,
  });

  test('without suggest ideas button', testFn);
});
