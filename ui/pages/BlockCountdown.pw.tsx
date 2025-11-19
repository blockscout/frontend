import React from 'react';

import { test, expect } from 'playwright/lib';

import BlockCountdown from './BlockCountdown';

test('short period until the block +@mobile', async({ render, mockApiResponse }) => {
  const height = '1234567890';
  const hooksConfig = {
    router: {
      query: { height: height },
    },
  };

  await mockApiResponse('general:block_countdown', {
    result: {
      CountdownBlock: height,
      CurrentBlock: '1234567700',
      RemainingBlock: '190',
      EstimateTimeInSec: String(24 * 60 * 60 + 3 * 60 * 60 + 42 * 60 + 11),
    },
  }, {
    queryParams: {
      module: 'block',
      action: 'getblockcountdown',
      blockno: height,
    },
  });
  const component = await render(<BlockCountdown hideCapybaraRunner/>, { hooksConfig });
  await expect(component).toHaveScreenshot();
});

test('long period until the block +@mobile', async({ render, mockApiResponse }) => {
  const height = '123456789012345678901234567890';
  const hooksConfig = {
    router: {
      query: { height: height },
    },
  };

  await mockApiResponse('general:block_countdown', {
    result: {
      CountdownBlock: height,
      CurrentBlock: '1234567700',
      RemainingBlock: '123456789012345678900000000190',
      EstimateTimeInSec: String(1234567890 * 24 * 60 * 60 + 3 * 60 * 60 + 42 * 60 + 11),
    },
  }, {
    queryParams: {
      module: 'block',
      action: 'getblockcountdown',
      blockno: height,
    },
  });
  const component = await render(<BlockCountdown hideCapybaraRunner/>, { hooksConfig });
  await expect(component).toHaveScreenshot();
});
