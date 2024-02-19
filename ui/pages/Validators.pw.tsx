import { test as base, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as textAdMock from 'mocks/ad/textAd';
import * as validatorsMock from 'mocks/validators/index';
import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
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

test.beforeEach(async({ page }) => {
  await page.route('https://request-global.czilladx.com/serve/native.php?z=19260bf627546ab7242', (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(textAdMock.duck),
  }));
  await page.route(textAdMock.duck.ad.thumbnail, (route) => {
    return route.fulfill({
      status: 200,
      path: './playwright/mocks/image_s.jpg',
    });
  });
});

test('base view +@mobile', async({ mount, page }) => {
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
