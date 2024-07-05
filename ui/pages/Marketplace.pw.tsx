import React from 'react';

import { apps as appsMock } from 'mocks/apps/apps';
import { securityReports as securityReportsMock } from 'mocks/apps/securityReports';
import { test, expect, devices } from 'playwright/lib';

import Marketplace from './Marketplace';

const MARKETPLACE_CONFIG_URL = 'http://localhost/marketplace-config.json';
const MARKETPLACE_SECURITY_REPORTS_URL = 'https://marketplace-security-reports.json';

test.beforeEach(async({ mockConfigResponse, mockEnvs, mockAssetResponse }) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_MARKETPLACE_ENABLED', 'true' ],
    [ 'NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', MARKETPLACE_CONFIG_URL ],
    [ 'NEXT_PUBLIC_MARKETPLACE_SECURITY_REPORTS_URL', MARKETPLACE_SECURITY_REPORTS_URL ],
  ]);
  await mockConfigResponse('NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', MARKETPLACE_CONFIG_URL, JSON.stringify(appsMock));
  await mockConfigResponse('NEXT_PUBLIC_MARKETPLACE_SECURITY_REPORTS_URL', MARKETPLACE_SECURITY_REPORTS_URL, JSON.stringify(securityReportsMock));
  await Promise.all(appsMock.map(app => mockAssetResponse(app.logo, './playwright/mocks/image_s.jpg')));
});

test('base view +@dark-mode', async({ render }) => {
  const component = await render(<Marketplace/>);

  await expect(component).toHaveScreenshot();
});

test('with featured app +@dark-mode', async({ render, mockEnvs }) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_MARKETPLACE_FEATURED_APP', 'hop-exchange' ],
  ]);
  const component = await render(<Marketplace/>);

  await expect(component).toHaveScreenshot();
});

test('with banner +@dark-mode', async({ render, mockEnvs, mockConfigResponse }) => {
  const MARKETPLACE_BANNER_CONTENT_URL = 'https://localhost/marketplace-banner.html';
  const MARKETPLACE_BANNER_LINK_URL = 'https://example.com';

  await mockEnvs([
    [ 'NEXT_PUBLIC_MARKETPLACE_BANNER_CONTENT_URL', MARKETPLACE_BANNER_CONTENT_URL ],
    [ 'NEXT_PUBLIC_MARKETPLACE_BANNER_LINK_URL', MARKETPLACE_BANNER_LINK_URL ],
  ]);
  await mockConfigResponse('MARKETPLACE_BANNER_CONTENT_URL', MARKETPLACE_BANNER_CONTENT_URL, './playwright/mocks/page.html', true);
  const component = await render(<Marketplace/>);

  await expect(component).toHaveScreenshot();
});

// I had a memory error while running tests in GH actions
// separate run for mobile tests fixes it
test.describe('mobile', () => {
  test.use({ viewport: devices['iPhone 13 Pro'].viewport });

  test('base view', async({ render }) => {
    const component = await render(<Marketplace/>);

    await expect(component).toHaveScreenshot();
  });

  test('with featured app', async({ render, mockEnvs }) => {
    await mockEnvs([
      [ 'NEXT_PUBLIC_MARKETPLACE_FEATURED_APP', 'hop-exchange' ],
    ]);
    const component = await render(<Marketplace/>);

    await expect(component).toHaveScreenshot();
  });

  test('with banner', async({ render, mockEnvs, mockConfigResponse }) => {
    const MARKETPLACE_BANNER_CONTENT_URL = 'https://localhost/marketplace-banner.html';
    const MARKETPLACE_BANNER_LINK_URL = 'https://example.com';

    await mockEnvs([
      [ 'NEXT_PUBLIC_MARKETPLACE_BANNER_CONTENT_URL', MARKETPLACE_BANNER_CONTENT_URL ],
      [ 'NEXT_PUBLIC_MARKETPLACE_BANNER_LINK_URL', MARKETPLACE_BANNER_LINK_URL ],
    ]);
    await mockConfigResponse('MARKETPLACE_BANNER_CONTENT_URL', MARKETPLACE_BANNER_CONTENT_URL, './playwright/mocks/page.html', true);
    const component = await render(<Marketplace/>);

    await expect(component).toHaveScreenshot();
  });
});
