import React from 'react';

import * as validatorsMock from 'mocks/validators/index';
import { test, expect } from 'playwright/lib';

import Validators from './Validators';

const chainType = 'stability';

test('base view +@mobile', async({ render, mockApiResponse, mockEnvs, mockTextAd }) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_VALIDATORS_CHAIN_TYPE', chainType ],
  ]);
  await mockApiResponse('validators', validatorsMock.validatorsResponse, { pathParams: { chainType } });
  await mockApiResponse('validators_counters', validatorsMock.validatorsCountersResponse, { pathParams: { chainType } });
  await mockTextAd();

  const component = await render(<Validators/>);

  await expect(component).toHaveScreenshot();
});
