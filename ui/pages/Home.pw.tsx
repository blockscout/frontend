import { test, expect, devices } from '@playwright/experimental-ct-react';
import type { Locator } from '@playwright/test';
import React from 'react';

import * as blockMock from 'mocks/blocks/block';
import * as dailyTxsMock from 'mocks/stats/daily_txs';
import * as statsMock from 'mocks/stats/index';
import * as txMock from 'mocks/txs/tx';
import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';
import * as configs from 'playwright/utils/configs';

import Home from './Home';

test.describe('default view', () => {
  let component: Locator;

  test.beforeEach(async({ page, mount }) => {
    await page.route(buildApiUrl('stats'), (route) => route.fulfill({
      status: 200,
      body: JSON.stringify(statsMock.base),
    }));
    await page.route(buildApiUrl('homepage_blocks'), (route) => route.fulfill({
      status: 200,
      body: JSON.stringify([
        blockMock.base,
        blockMock.base2,
      ]),
    }));
    await page.route(buildApiUrl('homepage_txs'), (route) => route.fulfill({
      status: 200,
      body: JSON.stringify([
        txMock.base,
        txMock.withContractCreation,
        txMock.withTokenTransfer,
      ]),
    }));
    await page.route(buildApiUrl('stats_charts_txs'), (route) => route.fulfill({
      status: 200,
      body: JSON.stringify(dailyTxsMock.base),
    }));

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
  const extendedTest = test.extend({
    context: contextWithEnvs([
      { name: 'NEXT_PUBLIC_HOMEPAGE_PLATE_BACKGROUND', value: `no-repeat center/cover url(${ IMAGE_URL })` },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ]) as any,
  });

  extendedTest('default view', async({ mount, page }) => {
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

  test('base view', async({ mount, page }) => {
    await page.route(buildApiUrl('stats'), (route) => route.fulfill({
      status: 200,
      body: JSON.stringify(statsMock.base),
    }));
    await page.route(buildApiUrl('homepage_blocks'), (route) => route.fulfill({
      status: 200,
      body: JSON.stringify([
        blockMock.base,
        blockMock.base2,
      ]),
    }));
    await page.route(buildApiUrl('homepage_txs'), (route) => route.fulfill({
      status: 200,
      body: JSON.stringify([
        txMock.base,
        txMock.withContractCreation,
        txMock.withTokenTransfer,
      ]),
    }));
    await page.route(buildApiUrl('stats_charts_txs'), (route) => route.fulfill({
      status: 200,
      body: JSON.stringify(dailyTxsMock.base),
    }));

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
