import { Box } from '@chakra-ui/react';
import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import LayoutHome from './LayoutHome';

const API_URL = buildApiUrl('homepage_indexing_status');

test('base view +@mobile', async({ mount, page }) => {
  await page.route(API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify({ finished_indexing_blocks: false, indexed_blocks_ratio: 0.1 }),
  }));

  const component = await mount(
    <TestApp>
      <LayoutHome>
        <Box pt={ 10 }>Error</Box>
      </LayoutHome>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
