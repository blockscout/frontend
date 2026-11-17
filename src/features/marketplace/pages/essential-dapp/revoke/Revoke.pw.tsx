import React from 'react';

import * as statsMock from 'src/slices/chain/stats/mocks';

import * as chainDataMock from 'src/features/multichain/mocks/chains';

import { test, expect } from 'playwright/lib';

import Revoke from './Revoke';

const ESSENTIAL_DAPPS_CONFIG = JSON.stringify({
  revoke: { chains: [ chainDataMock.chainA.id ] },
});

test('base view +@dark-mode +@mobile', async({ render, mockEnvs, mockEssentialDappsChainsConfig, mockAssetResponse, mockApiResponse }) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_MARKETPLACE_ENABLED', 'true' ],
    [ 'NEXT_PUBLIC_MARKETPLACE_ESSENTIAL_DAPPS_CONFIG', ESSENTIAL_DAPPS_CONFIG ],
  ]);
  await mockEssentialDappsChainsConfig();
  await mockAssetResponse(chainDataMock.chainA.logo as string, './playwright/mocks/image_s.jpg');
  // No wallet is connected, so the balance hook asks for an empty address
  await mockApiResponse('core:address', null as never, { pathParams: { hash: '' }, chainConfig: chainDataMock.chainA, status: 404 });
  await mockApiResponse('core:stats', statsMock.base, { chainConfig: chainDataMock.chainA });

  const component = await render(<Revoke/>);

  await expect(component).toHaveScreenshot();
});
