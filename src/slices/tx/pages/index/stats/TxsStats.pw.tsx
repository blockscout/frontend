import React from 'react';

import * as statsMock from 'src/slices/chain/stats/mocks';
import * as txsStatsMock from 'src/slices/tx/mocks/stats';

import { test, expect } from 'playwright/lib';

import TxsStats from './TxsStats';

test('base view +@mobile', async({ render, mockApiResponse, mockEnvs }) => {
  await mockEnvs([ [ 'NEXT_PUBLIC_STATS_API_HOST', '' ] ]);
  await mockApiResponse('core:stats', statsMock.base);
  await mockApiResponse('core:txs_stats', txsStatsMock.base);
  const component = await render(<TxsStats/>);
  await expect(component).toHaveScreenshot();
});
