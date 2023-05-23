import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as mocks from 'mocks/account/verifiedAddresses';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import AddressVerificationStepSignature from './AddressVerificationStepSignature';

const VERIFY_ADDRESS_URL = buildApiUrl('address_verification', { chainId: '1', type: ':verify' });

test('base view', async({ mount, page }) => {
  await page.route(VERIFY_ADDRESS_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(mocks.ADDRESS_VERIFY_RESPONSE.SUCCESS),
  }));

  const props = {
    onContinue: () => {},
    noWeb3Provider: true,
    address: mocks.VERIFIED_ADDRESS.NEW_ITEM.contractAddress,
    signingMessage: mocks.ADDRESS_CHECK_RESPONSE.SUCCESS.result.signingMessage,
  };

  await mount(
    <TestApp>
      <AddressVerificationStepSignature { ...props }/>
    </TestApp>,
  );

  await expect(page).toHaveScreenshot();
});

test('INVALID_SIGNER_ERROR view +@mobile', async({ mount, page }) => {
  await page.route(VERIFY_ADDRESS_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(mocks.ADDRESS_VERIFY_RESPONSE.INVALID_SIGNER_ERROR),
  }));

  const props = {
    onContinue: () => {},
    noWeb3Provider: true,
    address: mocks.VERIFIED_ADDRESS.NEW_ITEM.contractAddress,
    ...mocks.ADDRESS_CHECK_RESPONSE.SUCCESS.result,
  };

  await mount(
    <TestApp>
      <AddressVerificationStepSignature { ...props }/>
    </TestApp>,
  );

  const signatureInput = page.getByLabel(/signature hash/i);
  await signatureInput.fill(mocks.SIGNATURE);
  await page.getByRole('button', { name: /verify/i }).click();

  await expect(page).toHaveScreenshot();
});
