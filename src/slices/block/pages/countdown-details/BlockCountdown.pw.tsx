import React from 'react';

import { test, expect } from 'playwright/lib';
import * as pwConfig from 'playwright/utils/config';

import BlockCountdown from './BlockCountdown';

test.describe('short period until the block', () => {
  const height = '1234567890';
  const hooksConfig = {
    router: {
      query: { height: height },
    },
  };

  test.beforeEach(async({ mockApiResponse }) => {
    await mockApiResponse('core:block_countdown', {
      countdown_block_number: height,
      current_block_number: '1234567700',
      remaining_blocks_count: '190',
      estimated_time_in_seconds: String(24 * 60 * 60 + 3 * 60 * 60 + 42 * 60 + 11),
    }, {
      pathParams: { height },
    });
  });

  test('desktop', async({ render }) => {
    const component = await render(<BlockCountdown hideCapybaraRunner/>, { hooksConfig });
    await expect(component).toHaveScreenshot();
  });

  test.describe('mobile', () => {
    test.use({ viewport: pwConfig.viewport.mobile });
    test('base view', async({ render }) => {
      const component = await render(<BlockCountdown hideCapybaraRunner/>, { hooksConfig });
      await expect(component).toHaveScreenshot();
    });
  });
});

test.describe('long period until the block', () => {
  const height = '123456789012345678901234567890';
  const hooksConfig = {
    router: {
      query: { height: height },
    },
  };

  test.beforeEach(async({ mockApiResponse }) => {
    await mockApiResponse('core:block_countdown', {
      countdown_block_number: height,
      current_block_number: '1234567700',
      remaining_blocks_count: '123456789012345678900000000190',
      estimated_time_in_seconds: String(1234567890 * 24 * 60 * 60 + 3 * 60 * 60 + 42 * 60 + 11),
    }, {
      pathParams: { height },
    });
  });

  test('desktop', async({ render }) => {
    const component = await render(<BlockCountdown hideCapybaraRunner/>, { hooksConfig });
    await expect(component).toHaveScreenshot();
  });

  test.describe('mobile', () => {
    test.use({ viewport: pwConfig.viewport.mobile });
    test('base view', async({ render }) => {
      const component = await render(<BlockCountdown hideCapybaraRunner/>, { hooksConfig });
      await expect(component).toHaveScreenshot();
    });
  });
});
