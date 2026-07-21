import type { Locator } from '@playwright/test';
import React from 'react';

import * as blockListMock from 'src/slices/block/mocks/list';
import * as statsMock from 'src/slices/chain/stats/mocks';
import { HomeDataContextProvider } from 'src/slices/home/contexts/home-data-context';

import { test, expect } from 'playwright/lib';

import Stats from './Stats';

test.describe('all items', () => {
  let component: Locator;

  test.beforeEach(async({ render, mockApiResponse, mockEnvs }) => {
    await mockEnvs([
      [ 'NEXT_PUBLIC_HOMEPAGE_STATS', '["total_blocks","average_block_time","total_txs","wallet_addresses","gas_tracker","btc_locked"]' ],
      [ 'NEXT_PUBLIC_STATS_API_HOST', '' ],
    ]);
    await mockApiResponse('core:stats', statsMock.withBtcLocked);
    await mockApiResponse('core:homepage_blocks', blockListMock.baseListResponse.items);
    component = await render(
      <HomeDataContextProvider>
        <Stats/>
      </HomeDataContextProvider>,
    );
  });

  test('+@mobile +@dark-mode', async() => {
    await expect(component).toHaveScreenshot();
  });
});

test('no gas info', async({ render, mockApiResponse, mockEnvs }) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_STATS_API_HOST', '' ],
  ]);
  await mockApiResponse('core:stats', statsMock.withoutGasInfo);
  await mockApiResponse('core:homepage_blocks', blockListMock.baseListResponse.items);
  const component = await render(
    <HomeDataContextProvider>
      <Stats/>
    </HomeDataContextProvider>,
  );

  await expect(component).toHaveScreenshot();
});

test('4 items default view +@mobile -@default', async({ render, mockApiResponse, mockEnvs }) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_HOMEPAGE_STATS', '["total_txs","gas_tracker","wallet_addresses","total_blocks"]' ],
    [ 'NEXT_PUBLIC_STATS_API_HOST', '' ],
  ]);
  await mockApiResponse('core:stats', statsMock.base);
  await mockApiResponse('core:homepage_blocks', blockListMock.baseListResponse.items);
  const component = await render(
    <HomeDataContextProvider>
      <Stats/>
    </HomeDataContextProvider>,
  );
  await expect(component).toHaveScreenshot();
});

test('3 items default view +@mobile -@default', async({ render, mockApiResponse, mockEnvs }) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_HOMEPAGE_STATS', '["total_txs","wallet_addresses","total_blocks"]' ],
    [ 'NEXT_PUBLIC_STATS_API_HOST', '' ],
  ]);
  await mockApiResponse('core:stats', statsMock.base);
  await mockApiResponse('core:homepage_blocks', blockListMock.baseListResponse.items);
  const component = await render(
    <HomeDataContextProvider>
      <Stats/>
    </HomeDataContextProvider>,
  );
  await expect(component).toHaveScreenshot();
});
