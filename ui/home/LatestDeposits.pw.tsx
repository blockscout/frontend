import React from 'react';

import * as depositMock from 'mocks/l2deposits/deposits';
import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import LatestDeposits from './LatestDeposits';

test('default view +@mobile +@dark-mode', async({ render, mockApiResponse, mockEnvs }) => {
  await mockEnvs(ENVS_MAP.optimisticRollup);
  mockApiResponse('homepage_deposits', depositMock.data.items);
  const component = await render(<LatestDeposits/>);
  await expect(component).toHaveScreenshot();
});
