import React from 'react';

import * as rewardsConfigMock from 'src/features/rewards/mocks/rewards-config';

import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import HeaderDesktop from './HeaderDesktop';

test.beforeEach(async({ mockEnvs, mockApiResponse }) => {
  await mockEnvs([
    ...ENVS_MAP.rewardsService,
  ]);
  await mockApiResponse('rewards:config', rewardsConfigMock.base);
});

test('default view +@dark-mode', async({ render }) => {
  const component = await render(<HeaderDesktop/>);
  await expect(component).toHaveScreenshot();
});
