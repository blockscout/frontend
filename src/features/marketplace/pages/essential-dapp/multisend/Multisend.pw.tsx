import React from 'react';

import * as rpcMock from 'src/slices/block/mocks/rpc';

import type { TestFnArgs } from 'playwright/lib';
import { test, expect } from 'playwright/lib';
import * as pwConfig from 'playwright/utils/config';

import Multisend from './Multisend';

const ESSENTIAL_DAPPS_CONFIG = JSON.stringify({
  multisend: { chains: [ '1' ] },
});

test('base view +@dark-mode +@mobile', async({ render, mockEnvs, mockRpcResponse, page }: TestFnArgs) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_MARKETPLACE_ENABLED', 'true' ],
    [ 'NEXT_PUBLIC_MARKETPLACE_ESSENTIAL_DAPPS_CONFIG', ESSENTIAL_DAPPS_CONFIG ],
  ]);
  await mockRpcResponse([
    {
      Method: 'eth_getBlockByNumber',
      Parameters: [ 'latest', false ],
      ReturnType: rpcMock.rpcBlockBase,
    },
    {
      Method: 'eth_gasPrice',
      ReturnType: '0x1',
    },
  ]);

  // the widget mounts after the lazy wallet stack and shows a loader in the token input until its
  // chains-info request settles; an explicit error answers faster and more predictably than the abort
  await page.route('https://api.multisender.app/chain-info/chains', (route) => route.fulfill({ status: 500 }));

  const component = await render(<Multisend/>);
  await expect(component.getByPlaceholder('Select a token or enter token address')).toBeVisible();
  await expect(component.locator('.mantine-Loader-root')).toBeHidden();

  // the CSV editor is CodeMirror, whose placeholder settles its font a frame or two after mount
  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector), component.locator('.cm-editor') ],
    maskColor: pwConfig.maskColor,
  });
});
