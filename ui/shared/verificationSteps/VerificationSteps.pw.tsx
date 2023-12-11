import { Box } from '@chakra-ui/react';
import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import { ZKEVM_L2_TX_STATUSES } from 'types/api/transaction';

import TestApp from 'playwright/TestApp';

import VerificationSteps from './VerificationSteps';

test('first step +@mobile +@dark-mode', async({ mount }) => {

  const component = await mount(
    <TestApp>
      <Box p={ 10 }>
        <VerificationSteps currentStep={ ZKEVM_L2_TX_STATUSES[0] } steps={ ZKEVM_L2_TX_STATUSES }/>
      </Box>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('second status', async({ mount }) => {

  const component = await mount(
    <TestApp>
      <VerificationSteps currentStep={ ZKEVM_L2_TX_STATUSES[1] } steps={ ZKEVM_L2_TX_STATUSES }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
