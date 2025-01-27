import { Box } from '@chakra-ui/react';
import React from 'react';

import { mixTokens } from 'mocks/tokens/tokenTransfer';
import { test, expect } from 'playwright/lib';

import TokenTransfers from './TokenTransfers';

test('base view +@mobile', async({ render, mockTextAd, mockApiResponse }) => {
  await mockTextAd();
  await mockApiResponse('token_transfers_all', mixTokens, { queryParams: { type: [] } });
  const component = await render(<Box pt={{ base: '106px', lg: 0 }}> <TokenTransfers/> </Box>);
  await expect(component).toHaveScreenshot();
});
