import { Box } from '@chakra-ui/react';
import React from 'react';

import type { OptimisticL2WithdrawalStatus } from 'types/api/optimisticL2';

import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import TxDetailsWithdrawalStatusOptimistic from './TxDetailsWithdrawalStatusOptimistic';

const statuses: Array<OptimisticL2WithdrawalStatus> = [
  'Waiting for state root',
  'Ready for relay',
  'Relayed',
];

statuses.forEach((status) => {
  test(`status="${ status }"`, async({ render, mockEnvs }) => {
    await mockEnvs(ENVS_MAP.optimisticRollup);
    const component = await render(
      <Box p={ 2 }>
        <TxDetailsWithdrawalStatusOptimistic status={ status } l1TxHash="0x7d93a59a228e97d084a635181c3053e324237d07566ec12287eae6da2bcf9456"/>
      </Box>,
    );

    await expect(component).toHaveScreenshot();
  });
});
