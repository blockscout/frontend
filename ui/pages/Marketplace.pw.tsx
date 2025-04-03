import { Box } from '@chakra-ui/react';
import React from 'react';

import { apps as appsMock } from 'mocks/apps/apps';
import { ratings as ratingsMock } from 'mocks/apps/ratings';
import { securityReports as securityReportsMock } from 'mocks/apps/securityReports';
import { test, expect, devices } from 'playwright/lib';

import Marketplace from './Marketplace';

const MARKETPLACE_CONFIG_URL = 'http://localhost:4000/marketplace-config.json';
const MARKETPLACE_SECURITY_REPORTS_URL = 'https://localhost:4000/marketplace-security-reports.json';

test.beforeEach(async({ mockConfigResponse, mockEnvs, mockAssetResponse, page }) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_MARKETPLACE_ENABLED', 'true' ],
    [ 'NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', MARKETPLACE_CONFIG_URL ],
    [ 'NEXT_PUBLIC_MARKETPLACE_SECURITY_REPORTS_URL', MARKETPLACE_SECURITY_REPORTS_URL ],
    [ 'NEXT_PUBLIC_MARKETPLACE_RATING_AIRTABLE_API_KEY', 'test' ],
    [ 'NEXT_PUBLIC_MARKETPLACE_RATING_AIRTABLE_BASE_ID', 'test' ],
  ]);
  await mockConfigResponse('NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', MARKETPLACE_CONFIG_URL, appsMock);
  await mockConfigResponse('NEXT_PUBLIC_MARKETPLACE_SECURITY_REPORTS_URL', MARKETPLACE_SECURITY_REPORTS_URL, securityReportsMock);
  await Promise.all(appsMock.map(app => mockAssetResponse(app.logo, './playwright/mocks/image_s.jpg')));
  await page.route('https://api.airtable.com/v0/test/apps_ratings?fields%5B%5D=appId&fields%5B%5D=rating&fields%5B%5D=count', (route) => route.fulfill({
    status: 200,
    json: ratingsMock,
  }));
});

test('base view +@dark-mode', async({ render, page }) => {
  await page.evaluate(() => window.localStorage.setItem('favoriteApps', '["hop-exchange"]'));

  const component = await render(<Marketplace/>);

  await expect(component).toHaveScreenshot();
});

test('with featured app +@dark-mode', async({ render, mockEnvs, page }) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_MARKETPLACE_FEATURED_APP', 'hop-exchange' ],
  ]);
  await page.evaluate(() => window.localStorage.setItem('favoriteApps', '["hop-exchange"]'));

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

  test('base view', async({ render, page }) => {
    await page.evaluate(() => window.localStorage.setItem('favoriteApps', '["hop-exchange"]'));
    const component = await render(
      <Box>
        { /* Added a fake header because without the ActionBar works incorrectly without it */ }
        <Box h="100px" backgroundColor="#dbdbdb" p={ 1 }>
          Header
        </Box>
        <Marketplace/>
      </Box>,
    );

    await expect(component).toHaveScreenshot();
  });

  test('with featured app', async({ render, mockEnvs, page }) => {
    await mockEnvs([
      [ 'NEXT_PUBLIC_MARKETPLACE_FEATURED_APP', 'hop-exchange' ],
    ]);
    await page.evaluate(() => window.localStorage.setItem('favoriteApps', '["hop-exchange"]'));
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
