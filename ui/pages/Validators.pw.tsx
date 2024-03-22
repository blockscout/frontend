import React from 'react';

import * as validatorsMock from 'mocks/validators/index';
import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import { test as base, expect } from 'playwright/lib';
import * as configs from 'playwright/utils/configs';

import Validators from './Validators';

const test = base.extend({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: contextWithEnvs(configs.featureEnvs.validators) as any,
});

test('base view', async({ render, mockApiResponse }) => {
  await mockApiResponse(
    { resourceName: 'validators', pathParams: { chainType: 'stability' } },
    validatorsMock.validatorsResponse,
  );
  await mockApiResponse(
    { resourceName: 'validators_counters', pathParams: { chainType: 'stability' } },
    validatorsMock.validatorsCountersResponse,
  );

  const component = await render(<Validators/>);

  await expect(component).toHaveScreenshot();
});
