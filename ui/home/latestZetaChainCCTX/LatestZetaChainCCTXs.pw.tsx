import React from 'react';

import { zetaChainCCTXList } from 'mocks/zetaChain/zetaChainCCTX';
import { zetaChainCCTXConfig } from 'mocks/zetaChain/zetaChainCCTXConfig';
import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import LatestZetahainCCTXs from './LatestZetahainCCTXs';

const CCTX_CONFIG_URL = 'http://localhost:3000/zeta-config.json';

test.beforeEach(async({ mockEnvs, mockConfigResponse }) => {
  await mockEnvs(ENVS_MAP.zetaChain);
  await mockConfigResponse('NEXT_PUBLIC_ZETACHAIN_SERVICE_CHAINS_CONFIG_URL', CCTX_CONFIG_URL, zetaChainCCTXConfig);
});

test('base view +@dark-mode +@mobile', async({ render, mockApiResponse }) => {
  await mockApiResponse('zetachain:transactions', zetaChainCCTXList, {
    queryParams: {
      limit: 10,
      offset: 0,
      direction: 'DESC',
    },
  });

  const component = await render(<LatestZetahainCCTXs/>);

  await expect(component).toHaveScreenshot();
});
