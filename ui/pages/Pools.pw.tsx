import React from 'react';

import config from 'configs/app';
import * as poolMock from 'mocks/pools/pool';
import { test, expect } from 'playwright/lib';

import Pools from './Pools';

test('base view +@mobile +@dark-mode', async({ render, mockApiResponse, mockTextAd, mockAssetResponse }) => {
  await mockTextAd();
  await mockApiResponse(
    'pools',
    { items: [ poolMock.base, poolMock.noIcons, poolMock.base ], next_page_params: null },
    { pathParams: { chainId: config.chain.id } },
  );
  await mockAssetResponse(poolMock.base.quote_token_icon_url as string, './playwright/mocks/image_s.jpg');
  await mockAssetResponse(poolMock.base.base_token_icon_url as string, './playwright/mocks/image_s.jpg');
  const component = await render(<Pools/>);
  await expect(component).toHaveScreenshot();
});
