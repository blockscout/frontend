import React from 'react';

import { data as withdrawalsData } from 'src/features/rollup/optimism/mocks/withdrawals';

import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import OptimisticL2Withdrawals from './OptimisticL2Withdrawals';

test('base view', async({ render, mockTextAd, mockEnvs, mockApiResponse }) => {
  test.slow();
  await mockTextAd();
  await mockEnvs(ENVS_MAP.optimisticRollup);
  await mockApiResponse('core:optimistic_l2_withdrawals', withdrawalsData);
  await mockApiResponse('core:optimistic_l2_withdrawals_count', 397);
  const component = await render(<OptimisticL2Withdrawals/>);
  await expect(component).toHaveScreenshot({ timeout: 10_000 });
});
