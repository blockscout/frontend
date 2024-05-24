import type { Locator } from '@playwright/test';
import React from 'react';

import * as blockMock from 'mocks/blocks/block';
import * as dailyTxsMock from 'mocks/stats/daily_txs';
import * as statsMock from 'mocks/stats/index';
import * as txMock from 'mocks/txs/tx';
import { test, expect, devices } from 'playwright/lib';
import TestApp from 'playwright/TestApp';
import * as configs from 'playwright/utils/configs';

import Home from './Home';

test.describe('default view', () => {
  let component: Locator;

  test.beforeEach(async({ mount, mockApiResponse, mockAssetResponse }) => {
    await mockAssetResponse(statsMock.base.coin_image, './playwright/mocks/image_s.jpg');
    await mockApiResponse('stats', statsMock.base);
    await mockApiResponse('homepage_blocks', [
      blockMock.base,
      blockMock.base2,
    ]);
    await mockApiResponse('homepage_txs', [
      txMock.base,
      txMock.withContractCreation,
      txMock.withTokenTransfer,
    ]);
    await mockApiResponse('stats_charts_txs', dailyTxsMock.base);

    component = await mount(
      <TestApp>
        <Home/>
      </TestApp>,
    );
  });

  test('-@default +@dark-mode', async({ page }) => {
    await expect(component).toHaveScreenshot({
      mask: [ page.locator(configs.adsBannerSelector) ],
      maskColor: configs.maskColor,
    });
  });

  test.describe('screen xl', () => {
    test.use({ viewport: configs.viewport.xl });

    test('', async({ page }) => {
      await expect(component).toHaveScreenshot({
        mask: [ page.locator(configs.adsBannerSelector) ],
        maskColor: configs.maskColor,
      });
    });
  });
});

test.describe('custom hero plate background', () => {
  const IMAGE_URL = 'https://localhost:3000/my-image.png';
  test.beforeEach(async({ mockEnvs }) => {
    await mockEnvs([
      [ 'NEXT_PUBLIC_HOMEPAGE_PLATE_BACKGROUND', `no-repeat center/cover url(${ IMAGE_URL })` ],
    ]);
  });

  test('default view', async({ mount, page }) => {
    await page.route(IMAGE_URL, (route) => {
      return route.fulfill({
        status: 200,
        path: './playwright/mocks/image_long.jpg',
      });
    });

    const component = await mount(
      <TestApp>
        <Home/>
      </TestApp>,
    );

    const heroPlate = component.locator('div[data-label="hero plate"]');

    await expect(heroPlate).toHaveScreenshot({
      mask: [ page.locator(configs.adsBannerSelector) ],
      maskColor: configs.maskColor,
    });
  });
});

// had to separate mobile test, otherwise all the tests fell on CI
test.describe('mobile', () => {
  test.use({ viewport: devices['iPhone 13 Pro'].viewport });

  test('base view', async({ mount, page, mockAssetResponse, mockApiResponse }) => {
    await mockAssetResponse(statsMock.base.coin_image, './playwright/mocks/image_s.jpg');
    await mockApiResponse('stats', statsMock.base);
    await mockApiResponse('homepage_blocks', [
      blockMock.base,
      blockMock.base2,
    ]);
    await mockApiResponse('homepage_txs', [
      txMock.base,
      txMock.withContractCreation,
      txMock.withTokenTransfer,
    ]);
    await mockApiResponse('stats_charts_txs', dailyTxsMock.base);

    const component = await mount(
      <TestApp>
        <Home/>
      </TestApp>,
    );

    await expect(component).toHaveScreenshot({
      mask: [ page.locator(configs.adsBannerSelector) ],
      maskColor: configs.maskColor,
    });
  });
});
