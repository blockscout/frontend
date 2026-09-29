import React from 'react';

import type { TestFnArgs } from 'playwright/lib';
import { test, expect } from 'playwright/lib';
import * as pwConfig from 'playwright/utils/config';

import Multisend from './Multisend';

const ESSENTIAL_DAPPS_CONFIG = JSON.stringify({
  multisend: { chains: [ '1' ] },
});

test('base view +@dark-mode +@mobile', async({ render, mockEnvs, page }: TestFnArgs) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_MARKETPLACE_ENABLED', 'true' ],
    [ 'NEXT_PUBLIC_MARKETPLACE_ESSENTIAL_DAPPS_CONFIG', ESSENTIAL_DAPPS_CONFIG ],
  ]);

  // the widget mounts after the lazy wallet stack and only then requests chains info,
  // so the token input shows a loader until the global interceptor aborts that request
  const chainsInfoRequestFailed = page.waitForEvent('requestfailed', (request) => request.url() === 'https://api.multisender.app/chain-info/chains');

  const component = await render(<Multisend/>);
  await chainsInfoRequestFailed;

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector) ],
    maskColor: pwConfig.maskColor,
  });
});
