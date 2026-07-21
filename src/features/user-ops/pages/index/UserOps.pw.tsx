import React from 'react';

import * as statsMock from 'src/slices/chain/stats/mocks';

import { userOpsData } from 'src/features/user-ops/mocks/user-ops';

import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import UserOps from './UserOps';

test('base view +@mobile', async({ render, mockEnvs, mockTextAd, mockApiResponse }) => {
  test.slow();
  await mockEnvs(ENVS_MAP.userOps);
  await mockTextAd();
  await mockApiResponse('core:user_ops', userOpsData);
  await mockApiResponse('core:stats', { ...statsMock.base, coin_price: '2442.789' });

  const component = await render(<UserOps/>);
  await expect(component).toHaveScreenshot({ timeout: 10_000 });
});
