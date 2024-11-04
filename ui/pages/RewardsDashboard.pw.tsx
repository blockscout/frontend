import type { BrowserContext } from '@playwright/test';
import React from 'react';

import * as rewardsBalanceMock from 'mocks/rewards/balance';
import * as dailyRewardMock from 'mocks/rewards/dailyReward';
import * as referralsMock from 'mocks/rewards/referrals';
import * as rewardsConfigMock from 'mocks/rewards/rewardsConfig';
import * as profileMock from 'mocks/user/profile';
import { contextWithAuth } from 'playwright/fixtures/auth';
import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { contextWithRewards } from 'playwright/fixtures/rewards';
import { test, expect } from 'playwright/lib';

import RewardsDashboard from './RewardsDashboard';

const testWithAuth = test.extend<{ context: BrowserContext }>({
  context: contextWithAuth,
}).extend<{ context: BrowserContext }>({
  context: contextWithRewards,
});

testWithAuth.beforeEach(async({ mockEnvs, mockApiResponse }) => {
  await mockEnvs([ ...ENVS_MAP.rewardsService ]);
  await mockApiResponse('user_info', profileMock.withEmailAndWallet);
});

testWithAuth('base view +@dark-mode +@mobile', async({ render, mockApiResponse }) => {
  await mockApiResponse('rewards_user_balances', rewardsBalanceMock.base);
  await mockApiResponse('rewards_user_daily_check', dailyRewardMock.base);
  await mockApiResponse('rewards_user_referrals', referralsMock.base);
  await mockApiResponse('rewards_config', rewardsConfigMock.base);

  const component = await render(<RewardsDashboard/>);
  await expect(component).toHaveScreenshot();
});

testWithAuth('with error', async({ render }) => {
  const component = await render(<RewardsDashboard/>);
  await expect(component).toHaveScreenshot();
});
