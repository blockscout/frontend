import React from 'react';

import * as tokenMock from 'src/slices/token/mocks/info';

import * as epochMock from 'src/features/chain-variants/celo/mocks/epoch';

import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import Epoch from './Epoch';

test.beforeEach(async({ mockAssetResponse }) => {
  await mockAssetResponse(tokenMock.tokenInfoERC20a.icon_url as string, './playwright/mocks/image_s.jpg');
});

test('base view +@mobile', async({ render, mockEnvs, mockTextAd, mockApiResponse }) => {
  const hooksConfig = {
    router: {
      query: { number: String(epochMock.epoch1.number) },
    },
  };

  await mockEnvs(ENVS_MAP.celo);
  await mockTextAd();
  await mockApiResponse('core:epoch_celo', epochMock.epoch1, { pathParams: { number: String(epochMock.epoch1.number) } });

  const component = await render(<Epoch/>, { hooksConfig });

  await expect(component).toHaveScreenshot();
});

test('unfinalized epoch', async({ render, mockEnvs, mockTextAd, mockApiResponse }) => {
  const hooksConfig = {
    router: {
      query: { number: String(epochMock.epochUnfinalized.number) },
    },
  };

  await mockEnvs(ENVS_MAP.celo);
  await mockTextAd();
  await mockApiResponse('core:epoch_celo', epochMock.epochUnfinalized, { pathParams: { number: String(epochMock.epochUnfinalized.number) } });

  const component = await render(<Epoch/>, { hooksConfig });

  await expect(component).toHaveScreenshot();
});
