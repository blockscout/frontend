import React from 'react';

import type { TestFnArgs } from 'playwright/lib';
import { test, expect, devices } from 'playwright/lib';

import MarketplaceEssentialDapp from './MarketplaceEssentialDapp';

const ESSENTIAL_DAPPS_CONFIG = JSON.stringify({
  swap: { chains: [ '1' ], fee: '0.004', integrator: 'blockscout' },
  revoke: { chains: [ '1' ] },
  multisend: { chains: [ '1' ] },
});

const testFn = (id: string) => async({ render, mockEnvs, mockEssentialDappsChainsConfig }: TestFnArgs) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_MARKETPLACE_ENABLED', 'true' ],
    [ 'NEXT_PUBLIC_MARKETPLACE_ESSENTIAL_DAPPS_CONFIG', ESSENTIAL_DAPPS_CONFIG ],
  ]);
  await mockEssentialDappsChainsConfig();

  const component = await render(<MarketplaceEssentialDapp/>, {
    hooksConfig: { router: { query: { id }, isReady: true } },
  });

  await expect(component).toHaveScreenshot();
};

test('revoke +@dark-mode', testFn('revoke'));
test('multisend +@dark-mode', testFn('multisend'));

test.describe('mobile', () => {
  test.use({ viewport: devices['iPhone 13 Pro'].viewport });
  test('revoke', testFn('revoke'));
  test('multisend', testFn('multisend'));
});
