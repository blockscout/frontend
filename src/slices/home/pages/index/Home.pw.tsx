import type { Locator } from '@playwright/test';
import React from 'react';
import type { PublicRpcSchema, RpcTransaction } from 'viem';

import * as blockMock from 'src/slices/block/mocks/list';
import * as blockRpcMock from 'src/slices/block/mocks/rpc';
import * as statsMock from 'src/slices/chain/stats/mocks';
import * as dailyTxsMock from 'src/slices/home/mocks/charts';
import * as txMock from 'src/slices/tx/mocks/list';
import * as txRpcMock from 'src/slices/tx/mocks/rpc';

import * as statsMainMock from 'src/features/chain-stats/mocks/home';

import config from 'src/config';

import { test, expect, devices } from 'playwright/lib';
import * as pwConfig from 'playwright/utils/config';

import Home from './Home';

test.describe('default view', () => {
  let component: Locator;

  test.beforeEach(async({ render, mockApiResponse, mockAssetResponse }) => {
    await mockAssetResponse(statsMock.base.coin_image as string, './playwright/mocks/image_s.jpg');
    await mockApiResponse('stats:pages_main', statsMainMock.base);
    await mockApiResponse('core:stats', statsMock.base);
    await mockApiResponse('core:homepage_blocks', blockMock.baseListResponse.items);
    await mockApiResponse('core:homepage_txs', [
      txMock.base,
      txMock.withContractCreation,
      txMock.withTokenTransfer,
    ]);
    await mockApiResponse('core:stats_charts_txs', dailyTxsMock.base);

    component = await render(<Home/>);
  });

  // FIXME: test is flaky, screenshot in docker container is different from local
  test.skip('-@default +@dark-mode', async({ page }) => {
    await expect(component).toHaveScreenshot({
      mask: [ page.locator(pwConfig.adsBannerSelector) ],
      maskColor: pwConfig.maskColor,
    });
  });

  test.describe('screen xl', () => {
    test.use({ viewport: pwConfig.viewport.xl });

    test('base view', async({ page }) => {
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
    await mockApiResponse('stats:pages_main', statsMainMock.base);
    await mockApiResponse('core:stats', statsMock.base);
    await mockApiResponse('core:homepage_blocks', blockMock.baseListResponse.items);
    await mockApiResponse('core:homepage_txs', [
      txMock.base,
      txMock.withContractCreation,
      txMock.withTokenTransfer,
    ]);
    await mockApiResponse('core:stats_charts_txs', dailyTxsMock.base);

    const component = await render(<Home/>);

    await expect(component).toHaveScreenshot({
      mask: [ page.locator(pwConfig.adsBannerSelector) ],
      maskColor: pwConfig.maskColor,
    });
  });
});

test('degradation view', async({ render, mockApiResponse, mockRpcResponse, page }) => {
  test.slow();

  const txs: Array<RpcTransaction> = Array(10)
    .fill(blockRpcMock.rpcBlockWithTxsInfo.transactions[0])
    .map((tx, index) => ({
      ...tx,
      hash: tx.hash.slice(0, -1) + index.toString(),
    }));

  await mockApiResponse('stats:pages_main', null as never, { status: 500 });
  await mockApiResponse('core:stats', null as never, { status: 500 });
  await mockApiResponse('core:homepage_blocks', null as never, { status: 500 });
  await mockApiResponse('core:homepage_txs', null as never, { status: 500 });
  await mockApiResponse('core:stats_charts_txs', null as never, { status: 500 });

  await mockRpcResponse([
    {
      Method: 'eth_getBlockByNumber',
      Parameters: [ 'latest', true ],
      ReturnType: {
        ...blockRpcMock.rpcBlockWithTxsInfo,
        transactions: txs,
      },
    },
    {
      Method: 'eth_gasPrice',
      ReturnType: '0x3f011adb',
    },
    ...txs.slice(0, 5).map((tx) => ({
      Method: 'eth_getTransactionReceipt',
      Parameters: [ tx.hash ],
      ReturnType: {
        ...txRpcMock.rpcTxReceipt,
        transactionHash: tx.hash,
      },
    } satisfies PublicRpcSchema[number])),
  ]);

  const component = await render(<Home/>);

  await page.waitForResponse(config.chain.rpcUrls[0]);
  await page.waitForResponse(config.chain.rpcUrls[0]);

  // wait for receipt requests
  for (const url of Array(5).fill(config.chain.rpcUrls[0])) {
    await page.waitForResponse(url);
  }

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector) ],
    maskColor: pwConfig.maskColor,
  });
});

test('error view', async({ render, mockApiResponse, mockRpcResponse, page }) => {
  test.slow();
  await mockApiResponse('stats:pages_main', null as never, { status: 500 });
  await mockApiResponse('core:stats', null as never, { status: 500 });
  await mockApiResponse('core:homepage_blocks', null as never, { status: 500 });
  await mockApiResponse('core:homepage_txs', null as never, { status: 500 });
  await mockApiResponse('core:stats_charts_txs', null as never, { status: 500 });
  await mockRpcResponse([
    {
      Method: 'eth_getBlockByNumber',
      Parameters: [ 'latest', true ],
      ReturnType: blockRpcMock.rpcBlockBase,
      status: 500,
    },
    {
      Method: 'eth_gasPrice',
      ReturnType: '0x3f011adb',
      status: 500,
    },
  ]);

  const component = await render(<Home/>);
  // wait for all RPC requests
  // (1 initial request + 3 retries) * 2 resources = 8 requests
  for (const url of Array(8).fill(config.chain.rpcUrls[0])) {
    await page.waitForResponse(url);
  }

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector) ],
    maskColor: pwConfig.maskColor,
  });
});
