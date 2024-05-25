import React from 'react';

import * as contractMethodsMock from 'mocks/contract/methods';
import { test, expect } from 'playwright/lib';

import ContractWrite from './ContractWrite';

const addressHash = 'hash';
const hooksConfig = {
  router: {
    query: { hash: addressHash },
  },
};

test('base view +@mobile', async({ render, mockApiResponse }) => {
  await mockApiResponse(
    'contract_methods_write',
    contractMethodsMock.write,
    { pathParams: { hash: addressHash }, queryParams: { is_custom_abi: false } },
  );
  const component = await render(<ContractWrite/>, { hooksConfig });
  await component.getByText(/expand all/i).click();
  await expect(component).toHaveScreenshot();
});
