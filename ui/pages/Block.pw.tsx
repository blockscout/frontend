import React from 'react';
import { numberToHex } from 'viem';

import config from 'configs/app';
import * as blockMock from 'mocks/blocks/block';
import { test, expect } from 'playwright/lib';

import Block from './Block';

const height = String(blockMock.base.height);
const hooksConfig = {
  router: {
    query: { height_or_hash: height },
    isReady: true,
  },
};

test('degradation view, details tab', async({ render, mockApiResponse, mockRpcResponse, page }) => {
  await mockApiResponse('block', blockMock.base, { pathParams: { height_or_hash: height }, status: 500 });
  await mockRpcResponse({
    Method: 'eth_getBlockByNumber',
    Parameters: [ numberToHex(blockMock.base.height), false ],
    ReturnType: blockMock.baseRpcBlock,
  });

  const component = await render(<Block/>, { hooksConfig });
  await page.waitForResponse(config.chain.rpcUrl as string);

  await expect(component).toHaveScreenshot();
});
