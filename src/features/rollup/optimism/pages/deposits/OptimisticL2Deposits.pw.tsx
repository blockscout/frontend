import React from 'react';

import { data as depositsData } from 'src/features/rollup/optimism/mocks/deposits';

import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import OptimisticL2Deposits from './OptimisticL2Deposits';

test('base view', async({ render, mockEnvs, mockTextAd, mockApiResponse }) => {
  test.slow();
  await mockEnvs(ENVS_MAP.optimisticRollup);
  await mockTextAd();
  await mockApiResponse('core:optimistic_l2_deposits', depositsData);
  await mockApiResponse('core:optimistic_l2_deposits_count', 3971111);

  const component = await render(<OptimisticL2Deposits/>);

  await expect(component).toHaveScreenshot({ timeout: 10_000 });
});
