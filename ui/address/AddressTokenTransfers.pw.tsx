import { Box } from '@chakra-ui/react';
import { test, expect, devices } from '@playwright/experimental-ct-react';
import React from 'react';

import { erc1155A } from 'mocks/tokens/tokenTransfer';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import AddressTokenTransfers from './AddressTokenTransfers';

const API_URL = buildApiUrl('address_token_transfers', { hash: '0xd789a607CEac2f0E14867de4EB15b15C9FFB5859' }) +
 '?token=0x1189a607CEac2f0E14867de4EB15b15C9FFB5859';

const hooksConfig = {
  router: {
    query: { hash: '0xd789a607CEac2f0E14867de4EB15b15C9FFB5859', token: '0x1189a607CEac2f0E14867de4EB15b15C9FFB5859' },
  },
};

test('with token filter and pagination', async({ mount, page }) => {
  await page.route(API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify({ items: [ erc1155A ], next_page_params: { block_number: 1 } }),
  }));

  const component = await mount(
    <TestApp>
      <Box h={{ base: '134px', lg: 6 }}/>
      <AddressTokenTransfers/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();
});

test('with token filter and no pagination', async({ mount, page }) => {
  await page.route(API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify({ items: [ erc1155A ] }),
  }));

  const component = await mount(
    <TestApp>
      <Box h={{ base: '134px', lg: 6 }}/>
      <AddressTokenTransfers/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();
});

test.describe('mobile', () => {
  test.use({ viewport: devices['iPhone 13 Pro'].viewport });

  test('with token filter and pagination', async({ mount, page }) => {
    await page.route(API_URL, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify({ items: [ erc1155A ], next_page_params: { block_number: 1 } }),
    }));

    const component = await mount(
      <TestApp>
        <Box h={{ base: '134px', lg: 6 }}/>
        <AddressTokenTransfers/>
      </TestApp>,
      { hooksConfig },
    );

    await expect(component).toHaveScreenshot();
  });

  test('with token filter and no pagination', async({ mount, page }) => {
    await page.route(API_URL, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify({ items: [ erc1155A ] }),
    }));

    const component = await mount(
      <TestApp>
        <Box h={{ base: '134px', lg: 6 }}/>
        <AddressTokenTransfers/>
      </TestApp>,
      { hooksConfig },
    );

    await expect(component).toHaveScreenshot();
  });
});
