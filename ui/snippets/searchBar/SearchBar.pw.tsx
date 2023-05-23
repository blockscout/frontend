import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as textAdMock from 'mocks/ad/textAd';
import * as searchMock from 'mocks/search/index';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import SearchBar from './SearchBar';

test.beforeEach(async({ page }) => {
  await page.route('https://request-global.czilladx.com/serve/native.php?z=19260bf627546ab7242', (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(textAdMock.duck),
  }));
  await page.route(textAdMock.duck.ad.thumbnail, (route) => {
    return route.fulfill({
      status: 200,
      path: './playwright/image_s.jpg',
    });
  });
});

test('search by name  +@mobile +@dark-mode', async({ mount, page }) => {
  const API_URL = buildApiUrl('search') + '?q=o';
  await page.route(API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify({
      items: [
        searchMock.token1,
        searchMock.token2,
        searchMock.contract1,
      ],
    }),
  }));

  await mount(
    <TestApp>
      <SearchBar/>
    </TestApp>,
  );
  await page.getByPlaceholder(/search/i).type('o');
  await page.waitForResponse(API_URL);

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1200, height: 500 } });
});

test('search by address hash +@mobile', async({ mount, page }) => {
  const API_URL = buildApiUrl('search') + `?q=${ searchMock.address1.address }`;
  await page.route(API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify({
      items: [
        searchMock.address1,
      ],
    }),
  }));

  await mount(
    <TestApp>
      <SearchBar/>
    </TestApp>,
  );
  await page.getByPlaceholder(/search/i).type(searchMock.address1.address);
  await page.waitForResponse(API_URL);

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1200, height: 300 } });
});

test('search by block number +@mobile', async({ mount, page }) => {
  const API_URL = buildApiUrl('search') + `?q=${ searchMock.block1.block_number }`;
  await page.route(buildApiUrl('search') + `?q=${ searchMock.block1.block_number }`, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify({
      items: [
        searchMock.block1,
      ],
    }),
  }));

  await mount(
    <TestApp>
      <SearchBar/>
    </TestApp>,
  );
  await page.getByPlaceholder(/search/i).type(String(searchMock.block1.block_number));
  await page.waitForResponse(API_URL);

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1200, height: 300 } });
});

test('search by block hash +@mobile', async({ mount, page }) => {
  const API_URL = buildApiUrl('search') + `?q=${ searchMock.block1.block_hash }`;
  await page.route(buildApiUrl('search') + `?q=${ searchMock.block1.block_hash }`, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify({
      items: [
        searchMock.block1,
      ],
    }),
  }));

  await mount(
    <TestApp>
      <SearchBar/>
    </TestApp>,
  );
  await page.getByPlaceholder(/search/i).type(searchMock.block1.block_hash);
  await page.waitForResponse(API_URL);

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1200, height: 300 } });
});

test('search by tx hash +@mobile', async({ mount, page }) => {
  const API_URL = buildApiUrl('search') + `?q=${ searchMock.tx1.tx_hash }`;
  await page.route(buildApiUrl('search') + `?q=${ searchMock.tx1.tx_hash }`, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify({
      items: [
        searchMock.tx1,
      ],
    }),
  }));

  await mount(
    <TestApp>
      <SearchBar/>
    </TestApp>,
  );
  await page.getByPlaceholder(/search/i).type(searchMock.tx1.tx_hash);
  await page.waitForResponse(API_URL);

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1200, height: 300 } });
});

test('search with simple match', async({ mount, page }) => {
  const API_URL = buildApiUrl('search') + `?q=${ searchMock.tx1.tx_hash }`;
  const API_CHECK_REDIRECT_URL = buildApiUrl('search_check_redirect') + `?q=${ searchMock.tx1.tx_hash }`;

  await page.route(API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify({
      items: [
        searchMock.tx1,
      ],
    }),
  }));
  await page.route(API_CHECK_REDIRECT_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify({
      parameter: searchMock.tx1.tx_hash,
      redirect: true,
      type: 'transaction',
    }),
  }));

  await mount(
    <TestApp>
      <SearchBar/>
    </TestApp>,
  );
  await page.getByPlaceholder(/search/i).type(searchMock.tx1.tx_hash);
  await page.waitForResponse(API_URL);

  const resultText = page.getByText('Found 1 matching result');
  expect(resultText).toBeTruthy();

  const links = page.getByText(searchMock.tx1.tx_hash);
  await expect(links).toHaveCount(1);
});
