import React from 'react';

import { apps as appsMock } from 'mocks/apps/apps';
import * as searchMock from 'mocks/search/index';
import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import SearchResults from './SearchResults';

test.describe('search by name', () => {
  test('+@mobile +@dark-mode', async({ render, mockApiResponse, mockAssetResponse, mockEnvs }) => {
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
    await mockEnvs([
      [ 'NEXT_PUBLIC_MARKETPLACE_ENABLED', 'false' ],
    ]);
    await mockApiResponse('search', data, { queryParams: { q: 'o' } });
    await mockAssetResponse(searchMock.token1.icon_url as string, './playwright/mocks/image_s.jpg');
    const component = await render(<SearchResults/>, { hooksConfig });

    await expect(component.locator('main')).toHaveScreenshot();
  });
});

test('search by address hash +@mobile', async({ render, mockApiResponse }) => {
  const hooksConfig = {
    router: {
      query: { q: searchMock.address1.address },
    },
  };
  const data = {
    items: [ searchMock.address1, searchMock.contract2 ],
    next_page_params: null,
  };
  await mockApiResponse('search', data, { queryParams: { q: searchMock.address1.address } });

  const component = await render(<SearchResults/>, { hooksConfig });

  await expect(component.locator('main')).toHaveScreenshot();
});

test('search by block number +@mobile', async({ render, mockApiResponse }) => {
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

test('search by block hash +@mobile', async({ render, mockApiResponse }) => {
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

test('search by tx hash +@mobile', async({ render, mockApiResponse }) => {
  const hooksConfig = {
    router: {
      query: { q: searchMock.tx1.transaction_hash },
    },
  };
  const data = {
    items: [ searchMock.tx1 ],
    next_page_params: null,
  };
  await mockApiResponse('search', data, { queryParams: { q: searchMock.tx1.transaction_hash } });
  const component = await render(<SearchResults/>, { hooksConfig });

  await expect(component.locator('main')).toHaveScreenshot();
});

test('search by blob hash +@mobile', async({ render, mockApiResponse, mockEnvs }) => {
  const hooksConfig = {
    router: {
      query: { q: searchMock.blob1.blob_hash },
    },
  };
  const data = {
    items: [ searchMock.blob1 ],
    next_page_params: null,
  };
  await mockEnvs(ENVS_MAP.dataAvailability);
  await mockApiResponse('search', data, { queryParams: { q: searchMock.blob1.blob_hash } });
  const component = await render(<SearchResults/>, { hooksConfig });

  await expect(component.locator('main')).toHaveScreenshot();
});

test('search by domain name +@mobile', async({ render, mockApiResponse, mockEnvs }) => {
  const hooksConfig = {
    router: {
      query: { q: searchMock.domain1.ens_info.name },
    },
  };
  const data = {
    items: [ searchMock.domain1 ],
    next_page_params: null,
  };
  await mockEnvs(ENVS_MAP.nameService);
  await mockApiResponse('search', data, { queryParams: { q: searchMock.domain1.ens_info.name } });
  const component = await render(<SearchResults/>, { hooksConfig });
  await expect(component.locator('main')).toHaveScreenshot();
});

test('search by user op hash +@mobile', async({ render, mockApiResponse, mockEnvs }) => {
  const hooksConfig = {
    router: {
      query: { q: searchMock.userOp1.user_operation_hash },
    },
  };
  const data = {
    items: [ searchMock.userOp1 ],
    next_page_params: null,
  };
  await mockEnvs(ENVS_MAP.userOps);
  await mockApiResponse('search', data, { queryParams: { q: searchMock.userOp1.user_operation_hash } });
  const component = await render(<SearchResults/>, { hooksConfig });

  await expect(component.locator('main')).toHaveScreenshot();
});

test.describe('with apps', () => {
  test('default view +@mobile', async({ render, mockApiResponse, mockConfigResponse, mockAssetResponse, mockEnvs }) => {
    const MARKETPLACE_CONFIG_URL = 'https://localhost:4000/marketplace-config.json';
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
        transaction_hash: null,
      },
    };
    await mockEnvs([
      [ 'NEXT_PUBLIC_MARKETPLACE_ENABLED', 'true' ],
      [ 'NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', MARKETPLACE_CONFIG_URL ],
    ]);
    await mockApiResponse('search', data, { queryParams: { q: 'o' } });
    await mockConfigResponse('NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', MARKETPLACE_CONFIG_URL, appsMock);
    await mockAssetResponse(appsMock[0].logo, './playwright/mocks/image_s.jpg');
    await mockAssetResponse(appsMock[1].logo, './playwright/mocks/image_s.jpg');
    const component = await render(<SearchResults/>, { hooksConfig });

    await expect(component.locator('main')).toHaveScreenshot();
  });
});

test.describe('block countdown', () => {
  const blockHeight = '1234567890';
  const hooksConfig = {
    router: {
      query: { q: blockHeight },
    },
  };

  test('no results', async({ render, mockApiResponse }) => {
    await mockApiResponse('search', { items: [], next_page_params: null }, { queryParams: { q: blockHeight } });
    const component = await render(<SearchResults/>, { hooksConfig });

    await expect(component.locator('main')).toHaveScreenshot();
  });

  test('with results +@mobile', async({ render, mockApiResponse }) => {
    await mockApiResponse(
      'search',
      { items: [ { ...searchMock.token1, name: '1234567890123456789' } ], next_page_params: null },
      { queryParams: { q: blockHeight } },
    );
    const component = await render(<SearchResults/>, { hooksConfig });

    await expect(component.locator('main')).toHaveScreenshot();
  });
});
