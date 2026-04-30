import React from 'react';

import { ChartResolution } from 'toolkit/components/charts/types';

import { CROSS_CHAIN_TXS_CHARTS } from 'client/features/cross-chain-txs/utils/chain-stats';
import * as chainsMock from 'mocks/multichain/chains';
import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import * as crossChainTxsPathsMock from '../../mocks/cross-chain-txs-paths';
import * as statsLineMock from '../../mocks/line';
import ChainStatsDetails from './ChainStatsDetails';

test.beforeEach(async({ mockTextAd }) => {
  await mockTextAd();
});

test('base view +@dark-mode +@mobile', async({ render, mockApiResponse, page }) => {

  const CHART_ID = 'averageGasPrice';
  const hooksConfig = {
    router: {
      query: { id: CHART_ID, interval: 'all' },
    },
  };

  const chartApiUrl = await mockApiResponse(
    'stats:line',
    statsLineMock.averageGasPrice,
    {
      pathParams: { id: CHART_ID },
      queryParams: {
        resolution: ChartResolution.DAY,
      },
    },
  );

  const component = await render(<ChainStatsDetails/>, { hooksConfig });
  await page.waitForResponse(chartApiUrl);
  await page.waitForFunction(() => {
    return document.querySelector('path[data-name="chart-fullscreen"]')?.getAttribute('opacity') === '1';
  });
  await expect(component).toHaveScreenshot();
});

test('cross-chain txs paths view +@dark-mode +@mobile', async({ render, mockApiResponse, mockEnvs }) => {
  const CHART = CROSS_CHAIN_TXS_CHARTS[0];
  const hooksConfig = {
    router: {
      query: { id: CHART.id, interval: 'all' },
    },
  };

  await mockEnvs([
    ...ENVS_MAP.crossChainTxs,
    [ 'NEXT_PUBLIC_NETWORK_NAME', chainsMock.chainA.name ],
    [ 'NEXT_PUBLIC_NETWORK_ID', chainsMock.chainA.id ],
  ]);
  await mockApiResponse('interchainIndexer:chains', { items: [ chainsMock.chainA, chainsMock.chainB, chainsMock.chainC, chainsMock.chainD ] });
  await mockApiResponse(
    CHART.resourceName!,
    crossChainTxsPathsMock.incomingMessagesPaths,
    {
      pathParams: { chainId: chainsMock.chainA.id },
    },
  );

  const component = await render(<ChainStatsDetails/>, { hooksConfig });
  await expect(component).toHaveScreenshot();
});
