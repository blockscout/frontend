import React from 'react';

import * as statsMock from 'src/slices/chain/stats/mocks';

import { userOpData } from 'src/features/user-ops/mocks/user-op';

import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect, devices } from 'playwright/lib';

import UserOp from './UserOp';

const hooksConfig = {
  router: {
    query: { hash: userOpData.hash },
    isReady: true,
  },
};

test.beforeEach(async({ mockEnvs }) => {
  await mockEnvs(ENVS_MAP.userOps);
});

test('base view', async({ render, mockTextAd, mockApiResponse }) => {
  await mockTextAd();
  await mockApiResponse('core:user_op', userOpData, { pathParams: { hash: userOpData.hash } });
  await mockApiResponse('core:stats', { ...statsMock.base, coin_price: '2442.789' });

  const component = await render(<UserOp/>, { hooksConfig });
  await component.getByText('View details').click();
  await expect(component).toHaveScreenshot();
});

test.describe('mobile', () => {
  test.use({ viewport: devices['iPhone 13 Pro'].viewport });

  test('base view', async({ render, mockTextAd, mockApiResponse }) => {
    await mockTextAd();
    await mockApiResponse('core:user_op', userOpData, { pathParams: { hash: userOpData.hash } });
    await mockApiResponse('core:stats', { ...statsMock.base, coin_price: '2442.789' });

    const component = await render(<UserOp/>, { hooksConfig });
    await component.getByText('View details').click();
    await expect(component).toHaveScreenshot();
  });
});
