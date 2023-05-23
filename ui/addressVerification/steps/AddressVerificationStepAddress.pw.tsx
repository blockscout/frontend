import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as mocks from 'mocks/account/verifiedAddresses';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import AddressVerificationStepAddress from './AddressVerificationStepAddress';

const CHECK_ADDRESS_URL = buildApiUrl('address_verification', { chainId: '1', type: ':prepare' });

test('base view', async({ mount, page }) => {
  await page.route(CHECK_ADDRESS_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(mocks.ADDRESS_CHECK_RESPONSE.SUCCESS),
  }));

  const props = {
    onContinue: () => {},
    defaultAddress: mocks.VERIFIED_ADDRESS.NEW_ITEM.contractAddress,
  };

  await mount(
    <TestApp>
      <AddressVerificationStepAddress { ...props }/>
    </TestApp>,
  );

  await expect(page).toHaveScreenshot();
});

test('SOURCE_CODE_NOT_VERIFIED_ERROR view +@mobile', async({ mount, page }) => {
  await page.route(CHECK_ADDRESS_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(mocks.ADDRESS_CHECK_RESPONSE.SOURCE_CODE_NOT_VERIFIED_ERROR),
  }));

  const props = {
    onContinue: () => {},
  };

  await mount(
    <TestApp>
      <AddressVerificationStepAddress { ...props }/>
    </TestApp>,
  );

  const addressInput = page.getByLabel(/smart contract address/i);
  await addressInput.focus();
  await addressInput.type(mocks.VERIFIED_ADDRESS.NEW_ITEM.contractAddress);
  await page.getByRole('button', { name: /continue/i }).click();

  await expect(page).toHaveScreenshot();
});
