import { test as base, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import type { L2WithdrawalStatus } from 'types/api/l2Withdrawals';

import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import TestApp from 'playwright/TestApp';
import * as configs from 'playwright/utils/configs';

import TxDetailsWithdrawalStatus from './TxDetailsWithdrawalStatus';

const statuses: Array<L2WithdrawalStatus> = [
  'Waiting for state root',
  'Ready for relay',
  'Relayed',
];

const test = base.extend({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: contextWithEnvs(configs.featureEnvs.optimisticRollup) as any,
});

statuses.forEach((status) => {
  test(`status="${ status }"`, async({ mount }) => {

    const component = await mount(
      <TestApp>
        <TxDetailsWithdrawalStatus status={ status } l1TxHash="0x7d93a59a228e97d084a635181c3053e324237d07566ec12287eae6da2bcf9456"/>
      </TestApp>,
    );

    await expect(component).toHaveScreenshot();
  });
});
