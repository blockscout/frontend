import React from 'react';

import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import * as depositMock from '../../mocks/deposits';
import LatestArbitrumDeposits from './LatestArbitrumDeposits';

test('default view +@mobile', async({ render, mockApiResponse, mockEnvs }) => {
  await mockEnvs(ENVS_MAP.arbitrumRollup);
  mockApiResponse('general:homepage_arbitrum_deposits', depositMock.latestDepositsResponse);
  const component = await render(<LatestArbitrumDeposits/>);
  await expect(component).toHaveScreenshot();
});
