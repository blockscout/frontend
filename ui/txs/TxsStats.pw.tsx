import React from 'react';

import * as statsMock from 'mocks/stats';
import * as txsStatsMock from 'mocks/txs/stats';
import { test, expect } from 'playwright/lib';

import TxsStats from './TxsStats';

test('base view +@mobile', async({ render, mockApiResponse }) => {
  await mockApiResponse('stats', statsMock.base);
  await mockApiResponse('txs_stats', txsStatsMock.base);
  const component = await render(<TxsStats/>);
  await expect(component).toHaveScreenshot();
});
