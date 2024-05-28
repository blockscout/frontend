import React from 'react';

import { verifiedContractsCountersMock } from 'mocks/contracts/counters';
import * as verifiedContractsMock from 'mocks/contracts/index';
import { test, expect } from 'playwright/lib';

import VerifiedContracts from './VerifiedContracts';

test('base view +@mobile', async({ render, mockTextAd, mockApiResponse }) => {
  await mockTextAd();
  await mockApiResponse('verified_contracts', verifiedContractsMock.baseResponse);
  await mockApiResponse('verified_contracts_counters', verifiedContractsCountersMock);
  const component = await render(<VerifiedContracts/>);
  await expect(component).toHaveScreenshot();
});
