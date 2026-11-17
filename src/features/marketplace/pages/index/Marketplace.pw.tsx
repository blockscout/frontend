import { Box } from '@chakra-ui/react';
import React from 'react';

import { apps as appsMock } from 'src/features/marketplace/mocks/dapps';

import config from 'src/config';

import type { TestFnArgs } from 'playwright/lib';
import { test, expect, devices } from 'playwright/lib';
import * as pwConfig from 'playwright/utils/config';

import Marketplace from './Marketplace';

const ESSENTIAL_DAPPS_CONFIG = JSON.stringify({
  swap: { chains: [ config.chain.id ], fee: '0.004', integrator: 'blockscout' },
  revoke: { chains: [ config.chain.id ] },
  multisend: { chains: [ config.chain.id ] },
});

const MARKETPLACE_BANNER_CONTENT_URL = 'https://localhost/marketplace-banner.html';
const MARKETPLACE_BANNER_LINK_URL = 'https://example.com';

const mockDapps = (mockApiResponse: TestFnArgs['mockApiResponse']) => {
  return mockApiResponse('admin:marketplace_dapps', appsMock, { pathParams: { instanceId: config.apis.admin?.instanceId } });
};

test.beforeEach(async({ mockEnvs, mockAssetResponse }) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_MARKETPLACE_ENABLED', 'true' ],
  ]);
  await Promise.all(appsMock.map(app => mockAssetResponse(app.logo, './playwright/mocks/image_s.jpg')));
});

test('base view +@dark-mode', async({ render, page, mockApiResponse }) => {
  await mockDapps(mockApiResponse);
  await page.evaluate(() => window.localStorage.setItem('favoriteApps', '["hop-exchange"]'));

  const component = await render(<Marketplace/>);

  await expect(component).toHaveScreenshot();
});

test('with featured app +@dark-mode', async({ render, mockEnvs, mockApiResponse, page }) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_MARKETPLACE_FEATURED_APP', 'hop-exchange' ],
  ]);
  await mockDapps(mockApiResponse);
  await page.evaluate(() => window.localStorage.setItem('favoriteApps', '["hop-exchange"]'));

  const component = await render(<Marketplace/>);

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector) ],
    maskColor: pwConfig.maskColor,
  });
});

test('with banner +@dark-mode', async({ render, mockEnvs, mockApiResponse, mockConfigResponse, page }) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_MARKETPLACE_BANNER_CONTENT_URL', MARKETPLACE_BANNER_CONTENT_URL ],
    [ 'NEXT_PUBLIC_MARKETPLACE_BANNER_LINK_URL', MARKETPLACE_BANNER_LINK_URL ],
  ]);
  await mockDapps(mockApiResponse);
  await mockConfigResponse('MARKETPLACE_BANNER_CONTENT_URL', MARKETPLACE_BANNER_CONTENT_URL, './playwright/mocks/page.html', true);
  const component = await render(<Marketplace/>);

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector) ],
    maskColor: pwConfig.maskColor,
  });
});

test('with essential dapps +@dark-mode', async({ render, mockEnvs, mockApiResponse, mockConfigResponse, page }) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_MARKETPLACE_ESSENTIAL_DAPPS_CONFIG', ESSENTIAL_DAPPS_CONFIG ],
    [ 'NEXT_PUBLIC_MARKETPLACE_BANNER_CONTENT_URL', MARKETPLACE_BANNER_CONTENT_URL ],
    [ 'NEXT_PUBLIC_MARKETPLACE_BANNER_LINK_URL', MARKETPLACE_BANNER_LINK_URL ],
  ]);
  await mockDapps(mockApiResponse);
  await mockConfigResponse('MARKETPLACE_BANNER_CONTENT_URL', MARKETPLACE_BANNER_CONTENT_URL, './playwright/mocks/page.html', true);
  const component = await render(<Marketplace/>);
  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector) ],
    maskColor: pwConfig.maskColor,
  });
});

// I had a memory error while running tests in GH actions
// separate run for mobile tests fixes it
test.describe('mobile', () => {
  test.use({ viewport: devices['iPhone 13 Pro'].viewport });

  test('base view', async({ render, page, mockApiResponse }) => {
    await mockDapps(mockApiResponse);
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

  test('with featured app', async({ render, mockEnvs, mockApiResponse, page }) => {
    await mockEnvs([
      [ 'NEXT_PUBLIC_MARKETPLACE_FEATURED_APP', 'hop-exchange' ],
    ]);
    await mockDapps(mockApiResponse);
    await page.evaluate(() => window.localStorage.setItem('favoriteApps', '["hop-exchange"]'));
    const component = await render(<Marketplace/>);

    await expect(component).toHaveScreenshot();
  });

  test('with banner', async({ render, mockEnvs, mockApiResponse, mockConfigResponse }) => {
    await mockEnvs([
      [ 'NEXT_PUBLIC_MARKETPLACE_BANNER_CONTENT_URL', MARKETPLACE_BANNER_CONTENT_URL ],
      [ 'NEXT_PUBLIC_MARKETPLACE_BANNER_LINK_URL', MARKETPLACE_BANNER_LINK_URL ],
    ]);
    await mockDapps(mockApiResponse);
    await mockConfigResponse('MARKETPLACE_BANNER_CONTENT_URL', MARKETPLACE_BANNER_CONTENT_URL, './playwright/mocks/page.html', true);
    const component = await render(<Marketplace/>);

    await expect(component).toHaveScreenshot();
  });

  test('with essential dapps', async({ render, mockEnvs, mockApiResponse, mockConfigResponse }) => {
    await mockEnvs([
      [ 'NEXT_PUBLIC_MARKETPLACE_ESSENTIAL_DAPPS_CONFIG', ESSENTIAL_DAPPS_CONFIG ],
      [ 'NEXT_PUBLIC_MARKETPLACE_BANNER_CONTENT_URL', MARKETPLACE_BANNER_CONTENT_URL ],
      [ 'NEXT_PUBLIC_MARKETPLACE_BANNER_LINK_URL', MARKETPLACE_BANNER_LINK_URL ],
    ]);
    await mockDapps(mockApiResponse);
    await mockConfigResponse('MARKETPLACE_BANNER_CONTENT_URL', MARKETPLACE_BANNER_CONTENT_URL, './playwright/mocks/page.html', true);
    const component = await render(<Marketplace/>);
    await expect(component).toHaveScreenshot();
  });
});
