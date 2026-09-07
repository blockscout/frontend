import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';
import * as pwConfig from 'playwright/utils/config';

import { homeChain } from '../../mocks/chains';
import * as crossChainConfigMock from '../../mocks/config';
import * as crossChainTransfersMock from '../../mocks/transfers';
import * as crossChainTxMock from '../../mocks/txs';
import TransactionsCrossChain from './TransactionsCrossChain';

test.describe('txs', () => {
  test.slow();

  test.beforeEach(async({ mockEnvs, mockApiResponse, mockAssetResponse }) => {
    const queryParams = {
      home_chain_id: homeChain.id,
      include_unindexed_chains: false,
    };
    await mockEnvs(ENVS_MAP.crossChainTxs);
    await mockApiResponse('interchainIndexer:messages', crossChainTxMock.listResponse, { queryParams });
    await mockApiResponse(
      'interchainIndexer:stats_common',
      { total_messages: 100, total_transfers: 101, timestamp: '2022-01-13T12:00:00.000Z' },
      { queryParams },
    );
    await mockApiResponse('interchainIndexer:stats_daily', { daily_messages: 42, daily_transfers: 55, date: '2022-01-13' }, { queryParams });

    await mockAssetResponse(crossChainConfigMock.config[0].logo as string, './playwright/mocks/duck.png');
    await mockAssetResponse(crossChainConfigMock.config[1].logo as string, './playwright/mocks/goose.png');
    await mockAssetResponse(crossChainTransfersMock.transferA.source_token.icon_url as string, './playwright/mocks/image_s.jpg');
  });

  test.describe('desktop', () => {
    test.use({ viewport: pwConfig.viewport.xl });

    test('base view +@dark-mode', async({ render }) => {
      const component = await render(<TransactionsCrossChain/>);
      await expect(component).toHaveScreenshot({ timeout: 30_000 });
    });
  });

  test.describe('mobile', () => {
    test.use({ viewport: pwConfig.viewport.mobile });

    test('base view', async({ render }) => {
      const component = await render(<TransactionsCrossChain/>);
      await expect(component).toHaveScreenshot({ timeout: 30_000 });
    });
  });
});
