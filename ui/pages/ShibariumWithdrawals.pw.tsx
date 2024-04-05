import React from 'react';

import { data as withdrawalsData } from 'mocks/shibarium/withdrawals';
import type { StorageState } from 'playwright/fixtures/storageState';
import * as storageState from 'playwright/fixtures/storageState';
import { test as base, expect } from 'playwright/lib';

import ShibariumWithdrawals from './ShibariumWithdrawals';

const test = base.extend<{ storageState: StorageState }>({
  storageState: storageState.fixture(storageState.ENVS.shibariumRollup),
});

test('base view +@mobile', async({ render, mockApiResponse }) => {
  // test on mobile is flaky
  // my assumption is there is not enough time to calculate hashes truncation so component is unstable
  // so I raised the test timeout to check if it helps
  test.slow();

  await mockApiResponse('shibarium_withdrawals', withdrawalsData);
  await mockApiResponse('shibarium_withdrawals_count', 397);

  const component = await render(<ShibariumWithdrawals/>);

  await expect(component).toHaveScreenshot({ timeout: 10_000 });
});
