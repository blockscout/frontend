import { Box } from '@chakra-ui/react';
import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';

import TxZkEvmStatus from './TxZkEvmStatus';

test('first status +@mobile +@dark-mode', async({ mount }) => {

  const component = await mount(
    <TestApp>
      <Box p={ 10 }>
        <TxZkEvmStatus status="Confirmed by Sequencer"/>
      </Box>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('second status', async({ mount }) => {

  const component = await mount(
    <TestApp>
      <TxZkEvmStatus status="L1 Confirmed"/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
