import React from 'react';

import { outputRootsData } from 'client/features/rollup/optimism/mocks/output-roots';

import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import OptimisticL2OutputRoots from './OptimisticL2OutputRoots';

test('base view +@mobile', async({ render, mockEnvs, mockTextAd, mockApiResponse }) => {
  test.slow();
  await mockEnvs(ENVS_MAP.optimisticRollup);
  await mockTextAd();
  await mockApiResponse('general:optimistic_l2_output_roots', outputRootsData);
  await mockApiResponse('general:optimistic_l2_output_roots_count', 9927);
  const component = await render(<OptimisticL2OutputRoots/>);
  await expect(component).toHaveScreenshot({ timeout: 10_000 });
});
