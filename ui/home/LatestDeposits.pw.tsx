import { test as base, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as depositMock from 'mocks/l2deposits/deposits';
import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';
import * as configs from 'playwright/utils/configs';

import LatestDeposits from './LatestDeposits';

const test = base.extend({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: contextWithEnvs(configs.featureEnvs.optimisticRollup) as any,
});

test('default view +@mobile +@dark-mode', async({ mount, page }) => {
  await page.route(buildApiUrl('homepage_deposits'), (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(depositMock.data.items),
  }));

  const component = await mount(
    <TestApp>
      <LatestDeposits/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
