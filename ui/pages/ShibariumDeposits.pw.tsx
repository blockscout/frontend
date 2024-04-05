import React from 'react';

import { data as depositsData } from 'mocks/shibarium/deposits';
import type { StorageState } from 'playwright/fixtures/storageState';
import * as storageState from 'playwright/fixtures/storageState';
import { test as base, expect } from 'playwright/lib';

import ShibariumDeposits from './ShibariumDeposits';

const test = base.extend<{ storageState: StorageState }>({
  storageState: storageState.fixture(storageState.ENVS.shibariumRollup),
});

test('base view +@mobile', async({ render, mockApiResponse }) => {
  await mockApiResponse('shibarium_deposits', depositsData);
  await mockApiResponse('shibarium_deposits_count', 3971111);

  const component = await render(<ShibariumDeposits/>);

  await expect(component).toHaveScreenshot();
});
