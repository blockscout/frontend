import React from 'react';

import * as interopMessageMock from 'mocks/interop/interop';
import { test, expect } from 'playwright/lib';

import InteropMessages from './InteropMessages';

test('default view +@mobile', async({ render, mockTextAd, mockAssetResponse, mockApiResponse }) => {
  await mockTextAd();
  await mockAssetResponse(interopMessageMock.chain.chain_logo as string, './playwright/mocks/image_s.jpg');
  await mockApiResponse('optimistic_l2_interop_messages', {
    items: [
      interopMessageMock.interopMessageIn,
      interopMessageMock.interopMessageIn1,
      interopMessageMock.interopMessageOut,
      interopMessageMock.interopMessageOut1,
    ],
    next_page_params: {
      init_transaction_hash: '1',
      items_count: 4,
      timestamp: 1719456000,
    },
  });
  await mockApiResponse('optimistic_l2_interop_messages_count', 4000000);
  const component = await render(<InteropMessages/>);
  await expect(component).toHaveScreenshot();
});
