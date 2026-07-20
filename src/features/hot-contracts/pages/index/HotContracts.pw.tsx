import React from 'react';

import * as statsMock from 'src/slices/chain/stats/mocks';

import * as hotContractsMock from 'src/features/hot-contracts/mocks';
import { getIntervalValueFromQuery } from 'src/features/hot-contracts/utils';

import { test, expect } from 'playwright/lib';

import HotContracts from './HotContracts';

test('base view +@mobile', async({ render, mockTextAd, mockApiResponse, mockEnvs }) => {
  test.slow();
  await mockEnvs([ [ 'NEXT_PUBLIC_VIEWS_TOKEN_SCAM_TOGGLE_ENABLED', 'true' ] ]);
  await mockTextAd();
  await mockApiResponse(
    'core:stats_hot_contracts',
    hotContractsMock.hotContractsResponse,
    { queryParams: { scale: getIntervalValueFromQuery(undefined) } },
  );
  await mockApiResponse('core:stats', { ...statsMock.base, coin_price: '3214.42' });

  const component = await render(<HotContracts/>);
  await expect(component).toHaveScreenshot({ timeout: 10_000 });
});
