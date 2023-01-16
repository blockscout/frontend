import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as contractMethodsMock from 'mocks/contract/methods';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import ContractWrite from './ContractWrite';

const addressHash = 'hash';
const CONTRACT_READ_METHODS_API_URL = buildApiUrl('contract_methods_write', { id: addressHash });
const hooksConfig = {
  router: {
    query: { id: addressHash },
  },
};

test('base view +@mobile', async({ mount, page }) => {
  await page.route(CONTRACT_READ_METHODS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(contractMethodsMock.write),
  }));

  const component = await mount(
    <TestApp withWeb3>
      <ContractWrite/>
    </TestApp>,
    { hooksConfig },
  );

  await component.getByText(/expand all/i).click();

  await expect(component).toHaveScreenshot();
});
