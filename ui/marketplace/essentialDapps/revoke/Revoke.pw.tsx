import React from 'react';

import type { TestFnArgs } from 'playwright/lib';
import { test, expect } from 'playwright/lib';

import Revoke from './Revoke';

const ESSENTIAL_DAPPS_CONFIG = JSON.stringify({
  revoke: { chains: [ '1' ] },
});

test('base view +@dark-mode +@mobile', async({ render, mockEnvs, mockEssentialDappsChainsConfig }: TestFnArgs) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_MARKETPLACE_ENABLED', 'true' ],
    [ 'NEXT_PUBLIC_MARKETPLACE_ESSENTIAL_DAPPS_CONFIG', ESSENTIAL_DAPPS_CONFIG ],
  ]);
  await mockEssentialDappsChainsConfig();

  const component = await render(<Revoke/>);

  await expect(component).toHaveScreenshot();
});
