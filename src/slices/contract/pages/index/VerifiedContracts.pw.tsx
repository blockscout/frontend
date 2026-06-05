import React from 'react';

import { verifiedContractsCountersMock } from 'src/slices/contract/mocks/counters';
import * as verifiedContractsMock from 'src/slices/contract/mocks/list';

import { test, expect } from 'playwright/lib';

import VerifiedContracts from './VerifiedContracts';

test('base view +@mobile', async({ render, mockApiResponse, mockEnvs, mockTextAd }) => {
  test.slow();
  await mockTextAd();
  await mockEnvs([ [ 'NEXT_PUBLIC_STATS_API_HOST', '' ] ]);
  await mockApiResponse('core:verified_contracts', verifiedContractsMock.baseResponse);
  await mockApiResponse('core:verified_contracts_counters', verifiedContractsCountersMock);
  await mockApiResponse('core:config_contract_languages', { languages: [ 'solidity', 'vyper' ] });
  const component = await render(<VerifiedContracts/>);
  await expect(component).toHaveScreenshot({ timeout: 20_000 });
});
