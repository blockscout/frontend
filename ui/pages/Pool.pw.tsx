import React from 'react';

import config from 'configs/app';
import * as addressMock from 'mocks/address/address';
import * as poolMock from 'mocks/pools/pool';
import { test, expect } from 'playwright/lib';

import Pool from './Pool';

const addressHash = '0x1234';
const hooksConfig = {
  router: {
    query: { hash: addressHash },
  },
};

test('base view +@mobile +@dark-mode', async({ render, mockApiResponse, mockTextAd, mockAssetResponse }) => {
  await mockTextAd();
  await mockApiResponse('pool', poolMock.base, { pathParams: { chainId: config.chain.id, hash: addressHash } });
  await mockApiResponse('address', addressMock.contract, { pathParams: { hash: poolMock.base.contract_address } });
  await mockAssetResponse(poolMock.base.quote_token_icon_url as string, './playwright/mocks/image_s.jpg');
  await mockAssetResponse(poolMock.base.base_token_icon_url as string, './playwright/mocks/image_md.jpg');
  const component = await render(<Pool/>, { hooksConfig });
  await expect(component).toHaveScreenshot();
});
