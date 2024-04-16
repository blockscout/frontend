import { test as base, devices, expect } from '@playwright/experimental-ct-react';
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
const MARKETPLACE_BANNER_CONTENT_URL =
  app.url + buildExternalAssetFilePath('NEXT_PUBLIC_MARKETPLACE_BANNER_CONTENT_URL', 'https://marketplace-banner.html') || '';
const MARKETPLACE_BANNER_LINK_URL = 'https://example.com';

const test = base.extend({
  context: contextWithEnvs([
    { name: 'NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', value: MARKETPLACE_CONFIG_URL },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ]) as any,
});

const testFn: Parameters<typeof test>[1] = async({ mount, page }) => {
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

  await page.route(MARKETPLACE_BANNER_CONTENT_URL, (route) => route.fulfill({
    status: 200,
    path: './playwright/mocks/banner.html',
  }));

  const component = await mount(
    <TestApp>
      <Marketplace/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
};

test('base view +@dark-mode', testFn);

const testWithFeaturedApp = test.extend({
  context: contextWithEnvs([
    { name: 'NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', value: MARKETPLACE_CONFIG_URL },
    { name: 'NEXT_PUBLIC_MARKETPLACE_FEATURED_APP', value: 'hop-exchange' },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ]) as any,
});

testWithFeaturedApp('with featured app +@dark-mode', testFn);

const testWithBanner = test.extend({
  context: contextWithEnvs([
    { name: 'NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', value: MARKETPLACE_CONFIG_URL },
    { name: 'NEXT_PUBLIC_MARKETPLACE_BANNER_CONTENT_URL', value: MARKETPLACE_BANNER_CONTENT_URL },
    { name: 'NEXT_PUBLIC_MARKETPLACE_BANNER_LINK_URL', value: MARKETPLACE_BANNER_LINK_URL },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ]) as any,
});

testWithBanner('with banner +@dark-mode', testFn);

const testWithScoreFeature = test.extend({
  context: contextWithEnvs([
    { name: 'NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', value: MARKETPLACE_CONFIG_URL },
    { name: 'NEXT_PUBLIC_MARKETPLACE_SECURITY_REPORTS_URL', value: MARKETPLACE_SECURITY_REPORTS_URL },
    { name: 'pw_feature:security_score_exp', value: 'true' },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ]) as any,
});

testWithScoreFeature('with scores +@dark-mode', async({ mount, page }) => {
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

// I had a memory error while running tests in GH actions
// separate run for mobile tests fixes it
test.describe('mobile', () => {
  test.use({ viewport: devices['iPhone 13 Pro'].viewport });

  test('base view', testFn);
  testWithFeaturedApp('with featured app', testFn);
  testWithBanner('with banner', testFn);

  testWithScoreFeature('with scores', async({ mount, page }) => {
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
});
