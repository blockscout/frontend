import { Flex } from '@chakra-ui/react';
import { test as base, expect, devices } from '@playwright/experimental-ct-react';
import React from 'react';

import * as tokensMock from 'mocks/address/tokens';
import { tokenInfoERC20a } from 'mocks/tokens/tokenInfo';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';
import MockAddressPage from 'ui/address/testUtils/MockAddressPage';

import TokenSelect from './TokenSelect';

const ASSET_URL = tokenInfoERC20a.icon_url as string;
const TOKENS_ERC20_API_URL = buildApiUrl('address_tokens', { hash: '1' }) + '?type=ERC-20';
const TOKENS_ERC721_API_URL = buildApiUrl('address_tokens', { hash: '1' }) + '?type=ERC-721';
const TOKENS_ER1155_API_URL = buildApiUrl('address_tokens', { hash: '1' }) + '?type=ERC-1155';
const ADDRESS_API_URL = buildApiUrl('address', { hash: '1' });
const hooksConfig = {
  router: {
    query: { hash: '1' },
  },
};
const CLIPPING_AREA = { x: 0, y: 0, width: 360, height: 500 };

const test = base.extend({
  page: async({ page }, use) => {
    await page.route(ASSET_URL, (route) => {
      return route.fulfill({
        status: 200,
        path: './playwright/mocks/image_s.jpg',
      });
    });
    await page.route(ADDRESS_API_URL, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify({ hash: '1' }),
    }), { times: 1 });
    await page.route(TOKENS_ERC20_API_URL, async(route) => route.fulfill({
      status: 200,
      body: JSON.stringify(tokensMock.erc20List),
    }), { times: 1 });
    await page.route(TOKENS_ERC721_API_URL, async(route) => route.fulfill({
      status: 200,
      body: JSON.stringify(tokensMock.erc721List),
    }), { times: 1 });
    await page.route(TOKENS_ER1155_API_URL, async(route) => route.fulfill({
      status: 200,
      body: JSON.stringify(tokensMock.erc1155List),
    }), { times: 1 });

    use(page);
  },
});

test('base view +@dark-mode', async({ mount, page }) => {
  await mount(
    <TestApp>
      <MockAddressPage>
        <Flex>
          <TokenSelect/>
        </Flex>
      </MockAddressPage>
    </TestApp>,
    { hooksConfig },
  );

  await page.getByRole('button', { name: /select/i }).click();
  await page.getByText('USD Coin').hover();

  await expect(page).toHaveScreenshot({ clip: CLIPPING_AREA });

  await page.mouse.move(100, 200);
  await page.mouse.wheel(0, 1000);
  await expect(page).toHaveScreenshot({ clip: CLIPPING_AREA });
});

test.describe('mobile', () => {
  test.use({ viewport: devices['iPhone 13 Pro'].viewport });

  test('base view', async({ mount, page }) => {
    await mount(
      <TestApp>
        <MockAddressPage>
          <Flex>
            <TokenSelect/>
          </Flex>
        </MockAddressPage>
      </TestApp>,
      { hooksConfig },
    );

    await page.getByRole('button', { name: /select/i }).click();
    await page.getByText('USD Coin').hover();

    await expect(page).toHaveScreenshot();
  });
});

test('sort', async({ mount, page }) => {
  await mount(
    <TestApp>
      <MockAddressPage>
        <Flex>
          <TokenSelect/>
        </Flex>
      </MockAddressPage>
    </TestApp>,
    { hooksConfig },
  );
  await page.getByRole('button', { name: /select/i }).click();
  await page.locator('a[aria-label="Sort ERC-20 tokens"]').click();

  await expect(page).toHaveScreenshot({ clip: CLIPPING_AREA });

  await page.mouse.move(100, 200);
  await page.mouse.wheel(0, 1000);
  await page.locator('a[aria-label="Sort ERC-1155 tokens"]').click();

  await expect(page).toHaveScreenshot({ clip: CLIPPING_AREA });
});

test('filter', async({ mount, page }) => {
  await mount(
    <TestApp>
      <MockAddressPage>
        <Flex>
          <TokenSelect/>
        </Flex>
      </MockAddressPage>
    </TestApp>,
    { hooksConfig },
  );
  await page.getByRole('button', { name: /select/i }).click();
  await page.getByPlaceholder('Search by token name').type('c');

  await expect(page).toHaveScreenshot({ clip: CLIPPING_AREA });
});

base('long values', async({ mount, page }) => {
  await page.route(ASSET_URL, (route) => {
    return route.fulfill({
      status: 200,
      path: './playwright/mocks/image_s.jpg',
    });
  });
  await page.route(ADDRESS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify({ hash: '1' }),
  }), { times: 1 });
  await page.route(TOKENS_ERC20_API_URL, async(route) => route.fulfill({
    status: 200,
    body: JSON.stringify({ items: [ tokensMock.erc20LongSymbol ] }),
  }), { times: 1 });
  await page.route(TOKENS_ERC721_API_URL, async(route) => route.fulfill({
    status: 200,
    body: JSON.stringify({ items: [ tokensMock.erc721LongSymbol ] }),
  }), { times: 1 });
  await page.route(TOKENS_ER1155_API_URL, async(route) => route.fulfill({
    status: 200,
    body: JSON.stringify({ items: [ tokensMock.erc1155LongId ] }),
  }), { times: 1 });

  await mount(
    <TestApp>
      <MockAddressPage>
        <Flex>
          <TokenSelect/>
        </Flex>
      </MockAddressPage>
    </TestApp>,
    { hooksConfig },
  );
  await page.getByRole('button', { name: /select/i }).click();

  await expect(page).toHaveScreenshot({ clip: CLIPPING_AREA });
});
