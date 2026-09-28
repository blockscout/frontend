import React from 'react';

import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import { data as depositsData } from '../../mocks/deposits';
import BeaconChainDeposits from './BeaconChainDeposits';

test('base view', async({ render, mockEnvs, mockTextAd, mockApiResponse }) => {
  await mockEnvs(ENVS_MAP.beaconChain);
  await mockTextAd();
  await mockApiResponse('core:deposits', depositsData);
  await mockApiResponse('core:deposits_counters', { deposits_count: 111111 });
  const component = await render(<BeaconChainDeposits/>);
  await expect(component).toHaveScreenshot();
});
