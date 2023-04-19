import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as depositMock from 'mocks/l2deposits/deposits';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import LatestDeposits from './LatestDeposits';

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
