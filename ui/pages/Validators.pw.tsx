import React from 'react';

import * as validatorsMock from 'mocks/validators/index';
import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import { test as base, expect } from 'playwright/lib';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';
import * as configs from 'playwright/utils/configs';

import Validators from './Validators';

const VALIDATORS_API_URL = buildApiUrl('validators', { chainType: 'stability' });
const VALIDATORS_COUNTERS_API_URL = buildApiUrl('validators_counters', { chainType: 'stability' });

const test = base.extend({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: contextWithEnvs(configs.featureEnvs.validators) as any,
});

test('base view', async({ mount, page }) => {
  await page.route(VALIDATORS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(validatorsMock.validatorsResponse),
  }));
  await page.route(VALIDATORS_COUNTERS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(validatorsMock.validatorsCountersResponse),
  }));

  const component = await mount(
    <TestApp>
      <Validators/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
