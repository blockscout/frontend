import React from 'react';

import type { TestFnArgs } from 'playwright/lib';
import { test, expect } from 'playwright/lib';

import Multisend from './Multisend';

const ESSENTIAL_DAPPS_CONFIG = JSON.stringify({
  multisend: { chains: [ '1' ] },
});

test('base view +@dark-mode +@mobile', async({ render, mockEnvs }: TestFnArgs) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_MARKETPLACE_ENABLED', 'true' ],
    [ 'NEXT_PUBLIC_MARKETPLACE_ESSENTIAL_DAPPS_CONFIG', ESSENTIAL_DAPPS_CONFIG ],
  ]);

  const component = await render(<Multisend/>);

  await expect(component).toHaveScreenshot();
});
