import React from 'react';

import { apps as appsMock } from 'mocks/apps/apps';
import * as searchMock from 'mocks/search/index';
import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import SearchBar from './SearchBar';

test.beforeEach(async({ mockAssetResponse, mockEnvs, mockTextAd }) => {
  await mockTextAd();
  await mockAssetResponse(searchMock.token1.icon_url as string, './playwright/mocks/image_s.jpg');
  await mockEnvs([
    [ 'NEXT_PUBLIC_MARKETPLACE_ENABLED', 'false' ],
  ]);
});

test('search by token name  +@mobile +@dark-mode', async({ render, page, mockApiResponse }) => {
  const apiUrl = await mockApiResponse('quick_search', [
    searchMock.token1,
    searchMock.token2,
  ], { queryParams: { q: 'o' } });
  await render(<SearchBar/>);
  await page.getByPlaceholder(/search/i).fill('o');
  await page.waitForResponse(apiUrl);

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1200, height: 500 } });
});

test('search by contract name  +@mobile +@dark-mode', async({ render, page, mockApiResponse }) => {
  const apiUrl = await mockApiResponse('quick_search', [
    searchMock.contract1,
    searchMock.contract2,
    searchMock.address2,
  ], { queryParams: { q: 'o' } });

  await render(<SearchBar/>);
  await page.getByPlaceholder(/search/i).fill('o');
  await page.waitForResponse(apiUrl);

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1200, height: 500 } });
});

test('search by name homepage +@dark-mode', async({ render, page, mockApiResponse }) => {
  const apiUrl = await mockApiResponse('quick_search', [
    searchMock.token1,
    searchMock.token2,
    searchMock.contract1,
  ], { queryParams: { q: 'o' } });
  await render(<SearchBar isHomepage/>);
  await page.getByPlaceholder(/search/i).fill('o');
  await page.waitForResponse(apiUrl);

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1200, height: 500 } });
});

test('search by tag  +@mobile +@dark-mode', async({ render, page, mockApiResponse }) => {
  const apiUrl = await mockApiResponse('quick_search', [
    searchMock.label1,
  ], { queryParams: { q: 'o' } });
  await render(<SearchBar/>);
  await page.getByPlaceholder(/search/i).fill('o');
  await page.waitForResponse(apiUrl);

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1200, height: 500 } });
});

test('search by address hash +@mobile', async({ render, page, mockApiResponse }) => {
  const apiUrl = await mockApiResponse('quick_search', [
    searchMock.address1,
  ], { queryParams: { q: searchMock.address1.address } });
  await render(<SearchBar/>);
  await page.getByPlaceholder(/search/i).fill(searchMock.address1.address);
  await page.waitForResponse(apiUrl);

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1200, height: 300 } });
});

test('search by block number +@mobile', async({ render, page, mockApiResponse }) => {
  const apiUrl = await mockApiResponse('quick_search', [
    searchMock.block1,
    searchMock.block2,
    searchMock.block3,
  ], { queryParams: { q: searchMock.block1.block_number } });
  await render(<SearchBar/>);
  await page.getByPlaceholder(/search/i).fill(String(searchMock.block1.block_number));
  await page.waitForResponse(apiUrl);

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1200, height: 600 } });
});

test('search by block hash +@mobile', async({ render, page, mockApiResponse }) => {
  const apiUrl = await mockApiResponse('quick_search', [
    searchMock.block1,
  ], { queryParams: { q: searchMock.block1.block_hash } });
  await render(<SearchBar/>);
  await page.getByPlaceholder(/search/i).fill(searchMock.block1.block_hash);
  await page.waitForResponse(apiUrl);

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1200, height: 300 } });
});

test('search by tx hash +@mobile', async({ render, page, mockApiResponse }) => {
  const apiUrl = await mockApiResponse('quick_search', [
    searchMock.tx1,
  ], { queryParams: { q: searchMock.tx1.tx_hash } });
  await render(<SearchBar/>);
  await page.getByPlaceholder(/search/i).fill(searchMock.tx1.tx_hash);
  await page.waitForResponse(apiUrl);

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1200, height: 300 } });
});

test('search by blob hash +@mobile', async({ render, page, mockApiResponse, mockEnvs }) => {
  await mockEnvs(ENVS_MAP.dataAvailability);
  const apiUrl = await mockApiResponse('quick_search', [
    searchMock.blob1,
  ], { queryParams: { q: searchMock.blob1.blob_hash } });
  await render(<SearchBar/>);
  await page.getByPlaceholder(/search/i).fill(searchMock.blob1.blob_hash);
  await page.waitForResponse(apiUrl);

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1200, height: 300 } });
});

test('search by domain name +@mobile', async({ render, page, mockApiResponse, mockEnvs }) => {
  await mockEnvs(ENVS_MAP.nameService);
  const apiUrl = await mockApiResponse('quick_search', [
    searchMock.domain1,
  ], { queryParams: { q: searchMock.domain1.ens_info.name } });

  await render(<SearchBar/>);
  await page.getByPlaceholder(/search/i).fill(searchMock.domain1.ens_info.name);
  await page.waitForResponse(apiUrl);

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1200, height: 300 } });
});

test('search by user op hash +@mobile', async({ render, page, mockApiResponse, mockEnvs }) => {
  await mockEnvs(ENVS_MAP.userOps);
  const apiUrl = await mockApiResponse('quick_search', [
    searchMock.userOp1,
  ], { queryParams: { q: searchMock.tx1.tx_hash } });
  await render(<SearchBar/>);
  await page.getByPlaceholder(/search/i).fill(searchMock.tx1.tx_hash);
  await page.waitForResponse(apiUrl);

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1200, height: 300 } });
});

test('search with view all link', async({ render, page, mockApiResponse }) => {
  const apiUrl = await mockApiResponse('quick_search', [
    searchMock.token1,
    searchMock.token2,
    searchMock.contract1,
    ...Array(47).fill(searchMock.contract1),
  ], { queryParams: { q: 'o' } });
  await render(<SearchBar/>);
  await page.getByPlaceholder(/search/i).fill('o');
  await page.waitForResponse(apiUrl);

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1200, height: 500 } });
});

test('scroll suggest to category', async({ render, page, mockApiResponse }) => {
  const apiUrl = await mockApiResponse('quick_search', [
    searchMock.token1,
    searchMock.token2,
    searchMock.contract1,
    searchMock.token1,
    searchMock.token2,
    searchMock.contract1,
    searchMock.token1,
    searchMock.token2,
    searchMock.contract1,
    searchMock.token1,
    searchMock.token2,
    searchMock.contract1,
  ], { queryParams: { q: 'o' } });
  await render(<SearchBar/>);
  await page.getByPlaceholder(/search/i).fill('o');
  await page.waitForResponse(apiUrl);

  await page.getByRole('tab', { name: 'Addresses' }).click();

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1200, height: 500 } });
});

test('recent keywords suggest +@mobile', async({ render, page }, { project }) => {
  await render(<SearchBar/>);
  // eslint-disable-next-line max-len
  await page.evaluate(() => window.localStorage.setItem('recent_search_keywords', '["10x2d311959270e0bbdc1fc7bc6dbd8ad645c4dd8d6aa32f5f89d54629a924f112b","0x1d311959270e0bbdc1fc7bc6dbd8ad645c4dd8d6aa32f5f89d54629a924f112b","usd","bob"]'));
  await page.getByPlaceholder(/search/i).click();
  await page.getByText(project.name === 'mobile' ? '0x1d311959270e0bbdc1fc7bc6dbd...112b' : '0x1d311959270e0bbdc1fc7bc6dbd').isVisible();
  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1200, height: 500 } });
});

test.describe('with apps', () => {
  const MARKETPLACE_CONFIG_URL = 'http://localhost:4000/marketplace-config.json';

  test('default view +@mobile', async({ render, page, mockApiResponse, mockConfigResponse, mockAssetResponse, mockEnvs }) => {
    await mockEnvs([
      [ 'NEXT_PUBLIC_MARKETPLACE_ENABLED', 'true' ],
      [ 'NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', MARKETPLACE_CONFIG_URL ],
    ]);
    const apiUrl = await mockApiResponse('quick_search', [
      searchMock.token1,
    ], { queryParams: { q: 'o' } });
    await mockConfigResponse('NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', MARKETPLACE_CONFIG_URL, JSON.stringify(appsMock));
    await mockAssetResponse(appsMock[0].logo, './playwright/mocks/image_s.jpg');
    await mockAssetResponse(appsMock[1].logo, './playwright/mocks/image_s.jpg');

    await render(<SearchBar/>);
    await page.getByPlaceholder(/search/i).fill('o');
    await page.waitForResponse(apiUrl);

    await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1200, height: 500 } });
  });
});

test.describe('block countdown', () => {
  test('no results +@mobile', async({ render, page, mockApiResponse }) => {
    const apiUrl = await mockApiResponse('quick_search', [], { queryParams: { q: '1234567890' } });
    await render(<SearchBar/>);
    await page.getByPlaceholder(/search/i).fill('1234567890');
    await page.waitForResponse(apiUrl);

    await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1200, height: 500 } });
  });

  test('with results +@mobile', async({ render, page, mockApiResponse }) => {
    const apiUrl = await mockApiResponse('quick_search', [
      { ...searchMock.token1, name: '1234567890123456789' },
    ], { queryParams: { q: '1234567890' } });
    await render(<SearchBar/>);
    await page.getByPlaceholder(/search/i).fill('1234567890');
    await page.waitForResponse(apiUrl);

    await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 1200, height: 500 } });
  });
});
