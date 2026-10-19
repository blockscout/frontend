import React from 'react';

import * as rewardsConfigMock from 'src/features/rewards/mocks/rewards-config';

import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect, devices } from 'playwright/lib';

import HeaderMobile from './HeaderMobile';

test.use({ viewport: devices['iPhone 13 Pro'].viewport });

test.beforeEach(async({ mockEnvs, mockApiResponse }) => {
  await mockEnvs([
    ...ENVS_MAP.rewardsService,
  ]);
  await mockApiResponse('rewards:config', rewardsConfigMock.base);
});

test('default view +@dark-mode', async({ render, page }) => {
  await render(<HeaderMobile/>);
  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1500, height: 150 } });
});
