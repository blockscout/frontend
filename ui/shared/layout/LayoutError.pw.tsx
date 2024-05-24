import { Box } from '@chakra-ui/react';
import React from 'react';

import { indexingStatus } from 'mocks/stats/index';
import { test, expect } from 'playwright/lib';

import LayoutHome from './LayoutHome';

test('base view +@mobile', async({ render, mockApiResponse }) => {
  await mockApiResponse('homepage_indexing_status', indexingStatus);
  const component = await render(
    <LayoutHome>
      <Box pt={ 10 }>Error</Box>
    </LayoutHome>,
  );
  await expect(component).toHaveScreenshot();
});
