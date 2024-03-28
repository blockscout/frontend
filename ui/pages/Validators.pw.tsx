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

test('base view +@mobile', async({ render, mockApiResponse }) => {
  await mockApiResponse('validators', validatorsMock.validatorsResponse, { pathParams: { chainType: 'stability' } });
  await mockApiResponse('validators_counters', validatorsMock.validatorsCountersResponse, { pathParams: { chainType: 'stability' } });

  const component = await render(<Validators/>);

  await expect(component).toHaveScreenshot();
});
