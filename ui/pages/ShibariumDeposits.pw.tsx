import React from 'react';

import { data as depositsData } from 'mocks/shibarium/deposits';
import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import ShibariumDeposits from './ShibariumDeposits';

test('base view +@mobile', async({ render, mockApiResponse, mockEnvs, mockTextAd }) => {
  await mockTextAd();
  await mockEnvs(ENVS_MAP.shibariumRollup);
  await mockApiResponse('shibarium_deposits', depositsData);
  await mockApiResponse('shibarium_deposits_count', 3971111);

  const component = await render(<ShibariumDeposits/>);

  await expect(component).toHaveScreenshot();
});
