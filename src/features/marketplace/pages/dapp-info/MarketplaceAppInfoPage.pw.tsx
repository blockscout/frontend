import React from 'react';

import { apps as appsMock } from 'src/features/marketplace/mocks/dapps';

import config from 'src/config';

import { test, expect } from 'playwright/lib';

import MarketplaceAppInfoPage from './MarketplaceAppInfoPage';

const appId = String(appsMock[0].id);
const hooksConfig = {
  router: {
    query: { id: appId },
  },
};

test('base view +@mobile', async({ render, mockEnvs, mockAssetResponse, mockApiResponse }) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_MARKETPLACE_ENABLED', 'true' ],
  ]);
  await mockApiResponse('admin:marketplace_dapp', appsMock[0], { pathParams: { instanceId: config.apis.admin?.instanceId, dappId: appsMock[0].id } });
  await Promise.all(appsMock.map(app => mockAssetResponse(app.logo, './playwright/mocks/image_s.jpg')));

  const component = await render(<MarketplaceAppInfoPage/>, { hooksConfig });

  await expect(component).toHaveScreenshot();
});
