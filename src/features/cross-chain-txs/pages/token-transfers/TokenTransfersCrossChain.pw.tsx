import { Box } from '@chakra-ui/react';

import * as crossChainConfigMock from 'src/features/cross-chain-txs/mocks/config';
import * as crossChainCountersMock from 'src/features/cross-chain-txs/mocks/counters';
import * as crossChainTransfersMock from 'src/features/cross-chain-txs/mocks/transfers';

import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';
import * as pwConfig from 'playwright/utils/config';

import TokenTransfersCrossChain from './TokenTransfersCrossChain';

test.describe('txs', () => {
  test.beforeEach(async({ mockEnvs, mockApiResponse, mockAssetResponse }) => {
    await mockEnvs([
      ...ENVS_MAP.crossChainTxs,
      [ 'NEXT_PUBLIC_NETWORK_ID', crossChainConfigMock.config[0].id ],
    ]);
    await mockApiResponse('interchainIndexer:transfers', crossChainTransfersMock.listResponse);
    await mockApiResponse('stats:counters', crossChainCountersMock.counters);

    await mockAssetResponse(crossChainConfigMock.config[0].logo as string, './playwright/mocks/duck.png');
    await mockAssetResponse(crossChainConfigMock.config[1].logo as string, './playwright/mocks/goose.png');
    await mockAssetResponse(crossChainTransfersMock.transferA.source_token.icon_url as string, './playwright/mocks/image_s.jpg');
    await mockAssetResponse(crossChainTransfersMock.transferNative.destination_token.icon_url, './playwright/mocks/image_md.jpg');
  });

  test.describe('desktop', () => {
    test.use({ viewport: pwConfig.viewport.xl });

    test('base view +@dark-mode', async({ render }) => {
      const component = await render(
        <Box pt={ 10 }>
          <TokenTransfersCrossChain/>
        </Box>,
      );
      await expect(component).toHaveScreenshot();
    });
  });
});
