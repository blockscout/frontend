import type { Locator } from '@playwright/test';
import React from 'react';

import * as blockMock from 'mocks/blocks/block';
import * as statsMock from 'mocks/stats/index';
import { test, expect } from 'playwright/lib';

import { HomeDataContextProvider } from './homeDataContext';
import Stats from './Stats';

test.describe('all items', () => {
  let component: Locator;

  test.beforeEach(async({ render, mockApiResponse, mockEnvs }) => {
    await mockEnvs([
      [ 'NEXT_PUBLIC_HOMEPAGE_STATS', '["total_blocks","average_block_time","total_txs","wallet_addresses","gas_tracker","btc_locked"]' ],
      [ 'NEXT_PUBLIC_STATS_API_HOST', '' ],
    ]);
    await mockApiResponse('general:stats', statsMock.withBtcLocked);
    await mockApiResponse('general:homepage_blocks', [ blockMock.base, blockMock.base2 ]);
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
  await mockApiResponse('general:stats', statsMock.withoutGasInfo);
  await mockApiResponse('general:homepage_blocks', [ blockMock.base, blockMock.base2 ]);
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
  await mockApiResponse('general:stats', statsMock.base);
  await mockApiResponse('general:homepage_blocks', [ blockMock.base, blockMock.base2 ]);
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
  await mockApiResponse('general:stats', statsMock.base);
  await mockApiResponse('general:homepage_blocks', [ blockMock.base, blockMock.base2 ]);
  const component = await render(
    <HomeDataContextProvider>
      <Stats/>
    </HomeDataContextProvider>,
  );
  await expect(component).toHaveScreenshot();
});
