import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as textAdMock from 'mocks/ad/textAd';
import { verifiedContractsCountersMock } from 'mocks/contracts/counters';
import * as verifiedContractsMock from 'mocks/contracts/index';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import VerifiedContracts from './VerifiedContracts';

const VERIFIED_CONTRACTS_API_URL = buildApiUrl('verified_contracts');
const VERIFIED_CONTRACTS_COUNTERS_API_URL = buildApiUrl('verified_contracts_counters');

test.beforeEach(async({ page }) => {
  await page.route('https://request-global.czilladx.com/serve/native.php?z=19260bf627546ab7242', (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(textAdMock.duck),
  }));
  await page.route(textAdMock.duck.ad.thumbnail, (route) => {
    return route.fulfill({
      status: 200,
      path: './playwright/mocks/image_s.jpg',
    });
  });
});

test('base view +@mobile', async({ mount, page }) => {
  await page.route(VERIFIED_CONTRACTS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(verifiedContractsMock.baseResponse),
  }));
  await page.route(VERIFIED_CONTRACTS_COUNTERS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(verifiedContractsCountersMock),
  }));

  const component = await mount(
    <TestApp>
      <VerifiedContracts/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
