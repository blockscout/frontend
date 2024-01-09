import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as statsMock from 'mocks/stats/index';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import TopBar from './TopBar';

test('default view +@dark-mode +@mobile', async({ mount, page }) => {
  await page.route(buildApiUrl('homepage_stats'), (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(statsMock.base),
  }));

  const component = await mount(
    <TestApp>
      <TopBar/>
    </TestApp>,
  );

  await component.getByText(/gwei/i).hover();
  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1500, height: 220 } });

  await component.getByLabel('color mode switch').click();
  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1500, height: 220 } });
});
