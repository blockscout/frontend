import React from 'react';

import * as indexingStatusMock from 'src/slices/chain/indexing-status/mocks';

import { test, expect } from 'playwright/lib';

import LayoutHome from './LayoutHome';

// FIXME: at the moment, in the docker container playwright make screenshot before the page is completely loaded
// I cannot figure out the reason, so I skip this test for now
test.skip('base view +@mobile', async({ render, mockApiResponse }) => {
  await mockApiResponse('core:homepage_indexing_status', indexingStatusMock.blocksInProgress);
  const component = await render(<LayoutHome>Page Content</LayoutHome>);
  await expect(component).toHaveScreenshot();
});
