import { Box } from '@chakra-ui/react';

import * as tokenTransferMock from 'src/slices/token-transfer/mocks';
import * as tokenInstanceMock from 'src/slices/token/mocks/instance';

import { erc7984 } from 'src/features/fhe-operations/mocks/token-transfer';

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { devices, expect, test } from 'playwright/lib';

import TokenTransferList from './TokenTransferList';

test.use({ viewport: devices['iPhone 13 Pro'].viewport });

const data = [
  {
    ...tokenTransferMock.erc20,
    to: {
      ...tokenTransferMock.erc20.to,
      hash: tokenTransferMock.erc721.to.hash,
    },
  },
  tokenTransferMock.erc721,
  tokenTransferMock.erc1155C,
  erc7984,
  tokenTransferMock.erc8056,
];

test('without tx info', async({ render, mockAssetResponse, mockEnvs }) => {
  await mockEnvs(ENVS_MAP.additionalTokenTypes);
  await mockAssetResponse(tokenInstanceMock.base.image_url as string, './playwright/mocks/image_s.jpg');
  const component = await render(
    <Box pt={{ base: '134px', lg: 6 }}>
      <TokenTransferList
        data={ data }
        showTxInfo={ false }
      />
    </Box>,
  );

  await expect(component).toHaveScreenshot();
});

test('with tx info', async({ render, mockAssetResponse, mockEnvs }) => {
  await mockEnvs(ENVS_MAP.additionalTokenTypes);
  await mockAssetResponse(tokenInstanceMock.base.image_url as string, './playwright/mocks/image_s.jpg');
  const component = await render(
    <Box pt={{ base: '134px', lg: 6 }}>
      <TokenTransferList
        data={ data }
        showTxInfo={ true }
      />
    </Box>,
  );

  await expect(component).toHaveScreenshot();
});
