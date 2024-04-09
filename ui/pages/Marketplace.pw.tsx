import { test as base, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import { buildExternalAssetFilePath } from 'configs/app/utils';
import { apps as appsMock } from 'mocks/apps/apps';
import { securityReports as securityReportsMock } from 'mocks/apps/securityReports';
import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import TestApp from 'playwright/TestApp';
import * as app from 'playwright/utils/app';

import Marketplace from './Marketplace';

const MARKETPLACE_CONFIG_URL = app.url + buildExternalAssetFilePath('NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', 'https://marketplace-config.json') || '';
const MARKETPLACE_SECURITY_REPORTS_URL =
  app.url + buildExternalAssetFilePath('NEXT_PUBLIC_MARKETPLACE_SECURITY_REPORTS_URL', 'https://marketplace-security-reports.json') || '';

const test = base.extend({
  context: contextWithEnvs([
    { name: 'NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', value: MARKETPLACE_CONFIG_URL },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ]) as any,
});

test('base view +@mobile +@dark-mode', async({ mount, page }) => {
  await page.route(MARKETPLACE_CONFIG_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(appsMock),
  }));

  await Promise.all(appsMock.map(app =>
    page.route(app.logo, (route) =>
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
});

const testWithScoreFeature = test.extend({
  context: contextWithEnvs([
    { name: 'NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', value: MARKETPLACE_CONFIG_URL },
    { name: 'NEXT_PUBLIC_MARKETPLACE_SECURITY_REPORTS_URL', value: MARKETPLACE_SECURITY_REPORTS_URL },
    { name: 'pw_feature:security_score_exp', value: 'true' },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ]) as any,
});

testWithScoreFeature('with scores +@mobile +@dark-mode', async({ mount, page }) => {
  await page.route(MARKETPLACE_CONFIG_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(appsMock),
  }));

  await page.route(MARKETPLACE_SECURITY_REPORTS_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(securityReportsMock),
  }));

  await Promise.all(appsMock.map(app =>
    page.route(app.logo, (route) =>
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

  await component.getByText('Apps scores').click();

  await expect(component).toHaveScreenshot();
});
