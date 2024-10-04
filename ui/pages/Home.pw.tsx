import type { Locator } from '@playwright/test';
import React from 'react';

import * as blockMock from 'mocks/blocks/block';
import * as dailyTxsMock from 'mocks/stats/daily_txs';
import * as statsMock from 'mocks/stats/index';
import * as txMock from 'mocks/txs/tx';
import { test, expect, devices } from 'playwright/lib';
import * as pwConfig from 'playwright/utils/config';

import Home from './Home';

test.describe('default view', () => {
  let component: Locator;

  test.beforeEach(async({ render, mockApiResponse, mockAssetResponse }) => {
    await mockAssetResponse(statsMock.base.coin_image as string, './playwright/mocks/image_s.jpg');
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

    component = await render(<Home/>);
  });

  test('-@default +@dark-mode', async({ page }) => {
    await expect(component).toHaveScreenshot({
      mask: [ page.locator(pwConfig.adsBannerSelector) ],
      maskColor: pwConfig.maskColor,
    });
  });

  test.describe('screen xl', () => {
    test.use({ viewport: pwConfig.viewport.xl });

    test('', async({ page }) => {
      await expect(component).toHaveScreenshot({
        mask: [ page.locator(pwConfig.adsBannerSelector) ],
        maskColor: pwConfig.maskColor,
      });
    });
  });
});

// had to separate mobile test, otherwise all the tests fell on CI
test.describe('mobile', () => {
  test.use({ viewport: devices['iPhone 13 Pro'].viewport });

  test('base view', async({ render, page, mockAssetResponse, mockApiResponse }) => {
    await mockAssetResponse(statsMock.base.coin_image as string, './playwright/mocks/image_s.jpg');
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

    const component = await render(<Home/>);

    await expect(component).toHaveScreenshot({
      mask: [ page.locator(pwConfig.adsBannerSelector) ],
      maskColor: pwConfig.maskColor,
    });
  });
});
