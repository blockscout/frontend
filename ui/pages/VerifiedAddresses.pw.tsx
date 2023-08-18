import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as mocks from 'mocks/account/verifiedAddresses';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import VerifiedAddresses from './VerifiedAddresses';

const VERIFIED_ADDRESS_URL = buildApiUrl('verified_addresses', { chainId: '1' });
const TOKEN_INFO_APPLICATIONS_URL = buildApiUrl('token_info_applications', { chainId: '1', id: undefined });

test.beforeEach(async({ context }) => {
  await context.route(mocks.TOKEN_INFO_APPLICATION_BASE.iconUrl, (route) => {
    return route.fulfill({
      status: 200,
      path: './playwright/mocks/image_s.jpg',
    });
  });
});

test('base view +@mobile', async({ mount, page }) => {
  await page.route(VERIFIED_ADDRESS_URL, (route) => route.fulfill({
    body: JSON.stringify(mocks.VERIFIED_ADDRESS_RESPONSE.DEFAULT),
  }));

  await page.route(TOKEN_INFO_APPLICATIONS_URL, (route) => route.fulfill({
    body: JSON.stringify(mocks.TOKEN_INFO_APPLICATIONS_RESPONSE.DEFAULT),
  }));

  const component = await mount(
    <TestApp>
      <VerifiedAddresses/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('address verification flow', async({ mount, page }) => {
  const CHECK_ADDRESS_URL = buildApiUrl('address_verification', { chainId: '1', type: ':prepare' });
  const VERIFY_ADDRESS_URL = buildApiUrl('address_verification', { chainId: '1', type: ':verify' });

  await page.route(VERIFIED_ADDRESS_URL, (route) => route.fulfill({
    body: JSON.stringify(mocks.VERIFIED_ADDRESS_RESPONSE.DEFAULT),
  }));

  await page.route(TOKEN_INFO_APPLICATIONS_URL, (route) => route.fulfill({
    body: JSON.stringify(mocks.TOKEN_INFO_APPLICATIONS_RESPONSE.DEFAULT),
  }));

  await page.route(CHECK_ADDRESS_URL, (route) => route.fulfill({
    body: JSON.stringify(mocks.ADDRESS_CHECK_RESPONSE.SUCCESS),
  }));

  await page.route(VERIFY_ADDRESS_URL, (route) => {
    return route.fulfill({
      body: JSON.stringify(mocks.ADDRESS_VERIFY_RESPONSE.SUCCESS),
    });
  });

  await mount(
    <TestApp>
      <VerifiedAddresses/>
    </TestApp>,
  );

  // open modal
  await page.getByRole('button', { name: /add address/i }).click();

  // fill first step
  const addressInput = page.getByLabel(/smart contract address/i);
  await addressInput.fill(mocks.VERIFIED_ADDRESS.NEW_ITEM.contractAddress);
  await page.getByRole('button', { name: /continue/i }).click();

  // fill second step
  const signatureInput = page.getByLabel(/signature hash/i);
  await signatureInput.fill(mocks.SIGNATURE);
  await page.getByRole('button', { name: /verify/i }).click();

  // success screen
  await page.getByRole('button', { name: /view my verified addresses/i }).click();

  await expect(page).toHaveScreenshot();
});

test('application update flow', async({ mount, page }) => {
  const TOKEN_INFO_APPLICATION_URL = buildApiUrl('token_info_applications', { chainId: '1', id: mocks.TOKEN_INFO_APPLICATION.UPDATED_ITEM.id });
  const FORM_CONFIG_URL = buildApiUrl('token_info_applications_config', { chainId: '1' });

  await page.route(VERIFIED_ADDRESS_URL, (route) => route.fulfill({
    body: JSON.stringify(mocks.VERIFIED_ADDRESS_RESPONSE.DEFAULT),
  }));

  await page.route(TOKEN_INFO_APPLICATIONS_URL, (route) => route.fulfill({
    body: JSON.stringify(mocks.TOKEN_INFO_APPLICATIONS_RESPONSE.FOR_UPDATE),
  }));

  await page.route(FORM_CONFIG_URL, (route) => route.fulfill({
    body: JSON.stringify(mocks.TOKEN_INFO_FORM_CONFIG),
  }));

  // PUT request
  await page.route(TOKEN_INFO_APPLICATION_URL, (route) => route.fulfill({
    body: JSON.stringify(mocks.TOKEN_INFO_APPLICATION.UPDATED_ITEM),
  }));

  await mount(
    <TestApp>
      <VerifiedAddresses/>
    </TestApp>,
  );

  // open form
  await page.locator('tr').filter({ hasText: 'waiting for update' }).locator('button[aria-label="edit"]').click();

  // change project name
  const addressInput = page.getByLabel(/project name/i);
  await addressInput.fill('New name');

  await page.getByRole('button', { name: /send request/i }).click();

  const locator = page.locator('tr').filter({ hasText: 'in progress' }).filter({ hasText: 'nov 11, 2022' });
  await expect(locator).toBeVisible();
});
