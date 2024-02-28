import { Box } from '@chakra-ui/react';
import { test as base, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import { userOpsData } from 'mocks/userOps/userOps';
import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';
import * as configs from 'playwright/utils/configs';

import UserOps from './UserOps';

const test = base.extend({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: contextWithEnvs(configs.featureEnvs.userOps) as any,
});

const USER_OPS_API_URL = buildApiUrl('user_ops');

test('base view +@mobile', async({ mount, page }) => {
  await page.route('https://request-global.czilladx.com/serve/native.php?z=19260bf627546ab7242', (route) => route.fulfill({
    status: 200,
    body: '',
  }));

  await page.route(USER_OPS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(userOpsData),
  }));

  const component = await mount(
    <TestApp>
      <Box pt={{ base: '106px', lg: 0 }}>
        <UserOps/>
      </Box>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
