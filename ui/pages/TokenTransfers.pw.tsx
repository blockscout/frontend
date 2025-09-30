import { Box } from '@chakra-ui/react';
import React from 'react';

import * as tokenInstanceMock from 'mocks/tokens/tokenInstance';
import { mixTokens } from 'mocks/tokens/tokenTransfer';
import { test, expect } from 'playwright/lib';

import TokenTransfers from './TokenTransfers';

// FIXME: test is flaky, screenshot in docker container is different from local
test.skip('base view +@mobile', async({ render, mockTextAd, mockApiResponse, mockAssetResponse }) => {
  await mockAssetResponse(tokenInstanceMock.base.image_url as string, './playwright/mocks/image_s.jpg');
  await mockTextAd();
  await mockApiResponse('general:token_transfers_all', mixTokens, { queryParams: { type: [ 'all' ] } });
  const component = await render(<Box pt={{ base: '106px', lg: 0 }}> <TokenTransfers/> </Box>);
  await expect(component).toHaveScreenshot();
});
