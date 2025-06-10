import React from 'react';

import * as epochMock from 'mocks/epochs/celo';
import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import Epoch from './Epoch';

const hooksConfig = {
  router: {
    query: { number: String(epochMock.epoch1.number) },
  },
};

test('base view +@mobile', async({ render, mockEnvs, mockTextAd, mockApiResponse }) => {
  await mockEnvs(ENVS_MAP.celo);
  await mockTextAd();
  await mockApiResponse('general:epoch_celo', epochMock.epoch1, { pathParams: { number: String(epochMock.epoch1.number) } });
  await mockApiResponse('general:config_celo', {
    l2_migration_block: epochMock.epoch1.end_block_number - 50,
  });

  const component = await render(<Epoch/>, { hooksConfig });

  await expect(component).toHaveScreenshot();
});
