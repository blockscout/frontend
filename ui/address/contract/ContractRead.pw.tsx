import React from 'react';

import buildUrl from 'lib/api/buildUrl';
import * as contractMethodsMock from 'mocks/contract/methods';
import { test, expect } from 'playwright/lib';

import ContractRead from './ContractRead';

const addressHash = 'hash';
const hooksConfig = {
  router: {
    query: { hash: addressHash },
  },
};

test('base view +@mobile +@dark-mode', async({ render, mockApiResponse, page }) => {
  await mockApiResponse(
    'contract_methods_read',
    contractMethodsMock.read,
    { pathParams: { hash: addressHash }, queryParams: { is_custom_abi: false } },
  );
  const CONTRACT_QUERY_METHOD_API_URL = buildUrl('contract_method_query', { hash: addressHash }, { is_custom_abi: false });
  await page.route(CONTRACT_QUERY_METHOD_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(contractMethodsMock.readResultSuccess),
  }));
  const component = await render(<ContractRead/>, { hooksConfig });

  await component.getByText(/expand all/i).click();

  await expect(component).toHaveScreenshot();

  await component.getByPlaceholder(/address/i).fill('0xa113Ce24919C08a26C952E81681dAc861d6a2466');
  await component.getByText(/read/i).click();

  await component.getByText(/wei/i).click();

  await expect(component).toHaveScreenshot();
});
