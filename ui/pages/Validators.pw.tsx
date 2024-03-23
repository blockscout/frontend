import type { BrowserContext } from '@playwright/test';
import React from 'react';

import * as validatorsMock from 'mocks/validators/index';
import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import { test as base, expect } from 'playwright/lib';
import * as configs from 'playwright/utils/configs';

import Validators from './Validators';

const test = base.extend<{ context: BrowserContext }>({
  context: contextWithEnvs(configs.featureEnvs.validators),
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
