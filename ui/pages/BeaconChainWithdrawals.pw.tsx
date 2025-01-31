import React from 'react';

import { data as withdrawalsData } from 'mocks/withdrawals/withdrawals';
import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import BeaconChainWithdrawals from './BeaconChainWithdrawals';

test('base view +@mobile', async({ render, mockEnvs, mockTextAd, mockApiResponse }) => {
  await mockEnvs(ENVS_MAP.beaconChain);
  await mockTextAd();
  await mockApiResponse('withdrawals', withdrawalsData);
  await mockApiResponse('withdrawals_counters', { withdrawal_count: '111111', withdrawal_sum: '1010101010110101001101010' });
  const component = await render(<BeaconChainWithdrawals/>);
  await expect(component).toHaveScreenshot();
});
