import { Box } from '@chakra-ui/react';

import * as tokenTransferMock from 'src/slices/token-transfer/mocks';
import * as tokenInstanceMock from 'src/slices/token/mocks/instance';

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { expect, test } from 'playwright/lib';

import TokenTransferTable from './TokenTransferTable';

test('without tx info', async({ render, mockAssetResponse, mockEnvs }) => {
  await mockEnvs(ENVS_MAP.additionalTokenTypes);
  await mockAssetResponse(tokenInstanceMock.base.image_url as string, './playwright/mocks/image_s.jpg');
  const component = await render(
    <Box pt={{ base: '134px', lg: 6 }}>
      <TokenTransferTable
        data={ tokenTransferMock.mixTokens.items }
        top={ 0 }
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
      <TokenTransferTable
        data={ tokenTransferMock.mixTokens.items }
        top={ 0 }
        showTxInfo={ true }
      />
    </Box>,
  );

  await expect(component).toHaveScreenshot();
});
