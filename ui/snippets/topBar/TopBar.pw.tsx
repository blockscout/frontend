import { test as base, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as statsMock from 'mocks/stats/index';
import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import TopBar from './TopBar';

const test = base.extend({
  context: contextWithEnvs([
    { name: 'NEXT_PUBLIC_SWAP_BUTTON_URL', value: 'uniswap' },
    { name: 'NEXT_PUBLIC_NETWORK_SECONDARY_COIN_SYMBOL', value: 'DUCK' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ]) as any,
});

test('default view +@dark-mode +@mobile', async({ mount, page }) => {
  await page.route(buildApiUrl('stats'), (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(statsMock.base),
  }));

  const component = await mount(
    <TestApp>
      <TopBar/>
    </TestApp>,
  );

  await component.getByText(/\$1\.39/).click();
  await expect(page.getByText(/last update/i)).toBeVisible();
  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1500, height: 220 } });

  await component.getByLabel('User settings').click();
  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1500, height: 400 } });
});

test('with secondary coin price +@mobile', async({ mount, page }) => {
  await page.route(buildApiUrl('stats'), (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(statsMock.withSecondaryCoin),
  }));

  const component = await mount(
    <TestApp>
      <TopBar/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
