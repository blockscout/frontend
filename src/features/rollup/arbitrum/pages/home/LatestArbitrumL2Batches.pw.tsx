import React from 'react';

import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import { baseResponse } from '../../mocks/txn-batches';
import LatestArbitrumL2Batches from './LatestArbitrumL2Batches';

test('default view +@mobile +@dark-mode', async({ render, mockEnvs, mockApiResponse }) => {
  await mockEnvs(ENVS_MAP.arbitrumRollup);
  await mockApiResponse('core:homepage_arbitrum_l2_batches', baseResponse);

  const component = await render(<LatestArbitrumL2Batches/>);
  await expect(component).toHaveScreenshot();
});
