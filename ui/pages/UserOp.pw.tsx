import { test as base, expect, devices } from '@playwright/experimental-ct-react';
import React from 'react';

import { userOpData } from 'mocks/userOps/userOp';
import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';
import * as configs from 'playwright/utils/configs';

import UserOp from './UserOp';

const test = base.extend({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: contextWithEnvs(configs.featureEnvs.userOps) as any,
});

const USER_OP_API_URL = buildApiUrl('user_op', { hash: userOpData.hash });

test('base view', async({ mount, page }) => {
  await page.route('https://request-global.czilladx.com/serve/native.php?z=19260bf627546ab7242', (route) => route.fulfill({
    status: 200,
    body: '',
  }));

  await page.route(USER_OP_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(userOpData),
  }));

  const component = await mount(
    <TestApp>
      <UserOp/>
    </TestApp>,
    { hooksConfig: {
      router: {
        query: { hash: userOpData.hash },
        isReady: true,
      },
    } },
  );

  await expect(component).toHaveScreenshot();
});

test.describe('mobile', () => {
  test.use({ viewport: devices['iPhone 13 Pro'].viewport });

  test('base view', async({ mount, page }) => {
    await page.route('https://request-global.czilladx.com/serve/native.php?z=19260bf627546ab7242', (route) => route.fulfill({
      status: 200,
      body: '',
    }));

    await page.route(USER_OP_API_URL, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify(userOpData),
    }));

    const component = await mount(
      <TestApp>
        <UserOp/>
      </TestApp>,
      { hooksConfig: {
        router: {
          query: { hash: userOpData.hash },
          isReady: true,
        },
      } },
    );

    await expect(component).toHaveScreenshot();
  });
});
