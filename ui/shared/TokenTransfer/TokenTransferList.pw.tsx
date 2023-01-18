import { Box } from '@chakra-ui/react';
import { test, expect, devices } from '@playwright/experimental-ct-react';
import React from 'react';

import * as tokenTransferMock from 'mocks/tokens/tokenTransfer';
import TestApp from 'playwright/TestApp';

import { flattenTotal } from './helpers';
import TokenTransferList from './TokenTransferList';

const flattenData = tokenTransferMock.mixTokens.items.reduce(flattenTotal, []);

test.use({ viewport: devices['iPhone 13 Pro'].viewport });

test('without tx info', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <Box h={{ base: '134px', lg: 6 }}/>
      <TokenTransferList
        data={ flattenData }
        showTxInfo={ false }
      />
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('with tx info', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <Box h={{ base: '134px', lg: 6 }}/>
      <TokenTransferList
        data={ flattenData }
        showTxInfo={ true }
      />
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
