import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as mocks from 'mocks/account/verifiedAddresses';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import TokenInfoForm from './TokenInfoForm';

const FORM_CONFIG_URL = buildApiUrl('token_info_applications_config', { chainId: '1' });

test('base view +@mobile +@dark-mode', async({ mount, page }) => {
  await page.route(mocks.TOKEN_INFO_APPLICATION_BASE.iconUrl, (route) => {
    return route.fulfill({
      status: 200,
      path: './playwright/mocks/image_md.jpg',
    });
  });

  await page.route(FORM_CONFIG_URL, (route) => route.fulfill({
    body: JSON.stringify(mocks.TOKEN_INFO_FORM_CONFIG),
  }));

  const props = {
    address: mocks.VERIFIED_ADDRESS.ITEM_1.contractAddress,
    tokenName: 'Test Token (TT)',
    application: mocks.TOKEN_INFO_APPLICATION.APPROVED,
    onSubmit: () => {},
  };

  const component = await mount(
    <TestApp>
      <TokenInfoForm { ...props }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('status IN_PROCESS', async({ mount, page }) => {
  await page.route(mocks.TOKEN_INFO_APPLICATION_BASE.iconUrl, (route) => {
    return route.fulfill({
      status: 200,
      path: './playwright/mocks/image_md.jpg',
    });
  });

  await page.route(FORM_CONFIG_URL, (route) => route.fulfill({
    body: JSON.stringify(mocks.TOKEN_INFO_FORM_CONFIG),
  }));

  const props = {
    address: mocks.VERIFIED_ADDRESS.ITEM_1.contractAddress,
    tokenName: 'Test Token (TT)',
    application: mocks.TOKEN_INFO_APPLICATION.IN_PROCESS,
    onSubmit: () => {},
  };

  const component = await mount(
    <TestApp>
      <TokenInfoForm { ...props }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
