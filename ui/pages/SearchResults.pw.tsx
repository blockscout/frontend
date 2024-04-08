import React from 'react';

import { apps as appsMock } from 'mocks/apps/apps';
import * as searchMock from 'mocks/search/index';
import type { StorageState } from 'playwright/fixtures/storageState';
import * as storageState from 'playwright/fixtures/storageState';
import { test as base, expect } from 'playwright/lib';

import SearchResults from './SearchResults';

const noDappsTest = base.extend<{ storageState: StorageState }>({
  storageState: storageState.fixture([
    storageState.addEnv('NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', ''),
  ]),
});

noDappsTest.describe('search by name ', () => {
  noDappsTest('+@mobile +@dark-mode', async({ render, mockApiResponse, mockAssetResponse }) => {
    const hooksConfig = {
      router: {
        query: { q: 'o' },
      },
    };
    const data = {
      items: [
        searchMock.token1,
        searchMock.token2,
        searchMock.contract1,
        searchMock.address2,
        searchMock.label1,
      ],
      next_page_params: null,
    };
    await mockApiResponse('search', data, { queryParams: { q: 'o' } });
    await mockAssetResponse(searchMock.token1.icon_url as string, './playwright/mocks/image_s.jpg');
    const component = await render(<SearchResults/>, { hooksConfig });

    await expect(component.locator('main')).toHaveScreenshot();
  });
});

base('search by address hash +@mobile', async({ render, mockApiResponse }) => {
  const hooksConfig = {
    router: {
      query: { q: searchMock.address1.address },
    },
  };
  const data = {
    items: [ searchMock.address1 ],
    next_page_params: null,
  };
  await mockApiResponse('search', data, { queryParams: { q: searchMock.address1.address } });

  const component = await render(<SearchResults/>, { hooksConfig });

  await expect(component.locator('main')).toHaveScreenshot();
});

base('search by block number +@mobile', async({ render, mockApiResponse }) => {
  const hooksConfig = {
    router: {
      query: { q: String(searchMock.block1.block_number) },
    },
  };
  const data = {
    items: [ searchMock.block1, searchMock.block2, searchMock.block3 ],
    next_page_params: null,
  };
  await mockApiResponse('search', data, { queryParams: { q: searchMock.block1.block_number } });
  const component = await render(<SearchResults/>, { hooksConfig });

  await expect(component.locator('main')).toHaveScreenshot();
});

base('search by block hash +@mobile', async({ render, mockApiResponse }) => {
  const hooksConfig = {
    router: {
      query: { q: searchMock.block1.block_hash },
    },
  };
  const data = {
    items: [ searchMock.block1 ],
    next_page_params: null,
  };
  await mockApiResponse('search', data, { queryParams: { q: searchMock.block1.block_hash } });
  const component = await render(<SearchResults/>, { hooksConfig });

  await expect(component.locator('main')).toHaveScreenshot();
});

base('search by tx hash +@mobile', async({ render, mockApiResponse }) => {
  const hooksConfig = {
    router: {
      query: { q: searchMock.tx1.tx_hash },
    },
  };
  const data = {
    items: [ searchMock.tx1 ],
    next_page_params: null,
  };
  await mockApiResponse('search', data, { queryParams: { q: searchMock.tx1.tx_hash } });
  const component = await render(<SearchResults/>, { hooksConfig });

  await expect(component.locator('main')).toHaveScreenshot();
});

base('search by blob hash +@mobile', async({ render, mockApiResponse }) => {
  const hooksConfig = {
    router: {
      query: { q: searchMock.blob1.blob_hash },
    },
  };
  const data = {
    items: [ searchMock.blob1 ],
    next_page_params: null,
  };
  await mockApiResponse('search', data, { queryParams: { q: searchMock.blob1.blob_hash } });
  const component = await render(<SearchResults/>, { hooksConfig });

  await expect(component.locator('main')).toHaveScreenshot();
});

const userOpsTest = base.extend<{ storageState: StorageState }>({
  storageState: storageState.fixture(storageState.ENVS.userOps),
});

userOpsTest('search by user op hash +@mobile', async({ render, mockApiResponse }) => {
  const hooksConfig = {
    router: {
      query: { q: searchMock.userOp1.user_operation_hash },
    },
  };
  const data = {
    items: [ searchMock.userOp1 ],
    next_page_params: null,
  };
  await mockApiResponse('search', data, { queryParams: { q: searchMock.userOp1.user_operation_hash } });
  const component = await render(<SearchResults/>, { hooksConfig });

  await expect(component.locator('main')).toHaveScreenshot();
});

const MARKETPLACE_CONFIG_URL = 'https://marketplace-config.json';
const dappsTest = base.extend<{ storageState: StorageState }>({
  storageState: storageState.fixture([
    storageState.addEnv('NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', MARKETPLACE_CONFIG_URL),
  ]),
});

dappsTest.describe('with apps', () => {
  dappsTest('default view +@mobile', async({ render, mockApiResponse, mockConfigResponse, mockAssetResponse }) => {
    const hooksConfig = {
      router: {
        query: { q: 'o' },
      },
    };
    const data = {
      items: [ searchMock.token1 ],
      next_page_params: {
        address_hash: null,
        block_hash: null,
        holder_count: null,
        inserted_at: null,
        item_type: 'token' as const,
        items_count: 1,
        name: 'foo',
        q: 'o',
        tx_hash: null,
      },
    };
    await mockApiResponse('search', data, { queryParams: { q: 'o' } });
    await mockConfigResponse('NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', MARKETPLACE_CONFIG_URL, JSON.stringify(appsMock));
    await mockAssetResponse(appsMock[0].logo, './playwright/mocks/image_s.jpg');
    await mockAssetResponse(appsMock[1].logo, './playwright/mocks/image_s.jpg');
    const component = await render(<SearchResults/>, { hooksConfig });

    await expect(component.locator('main')).toHaveScreenshot();
  });
});
