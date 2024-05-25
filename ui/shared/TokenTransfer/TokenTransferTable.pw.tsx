import { Box } from '@chakra-ui/react';
import React from 'react';

import * as tokenTransferMock from 'mocks/tokens/tokenTransfer';
import { test, expect } from 'playwright/lib';

import TokenTransferTable from './TokenTransferTable';

test('without tx info', async({ render }) => {
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

test('with tx info', async({ render }) => {
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
