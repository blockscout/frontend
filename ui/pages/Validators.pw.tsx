import React from 'react';

import * as validatorsMock from 'mocks/validators/index';
import type { StorageState } from 'playwright/fixtures/storageState';
import * as storageState from 'playwright/fixtures/storageState';
import { test as base, expect } from 'playwright/lib';

import Validators from './Validators';

const chainType = 'stability';

const test = base.extend<{ storageState: StorageState }>({
  storageState: storageState.fixture([
    storageState.envMock('NEXT_PUBLIC_VALIDATORS_CHAIN_TYPE', chainType),
  ]),
});

test('base view +@mobile', async({ render, mockApiResponse }) => {
  await mockApiResponse('validators', validatorsMock.validatorsResponse, { pathParams: { chainType } });
  await mockApiResponse('validators_counters', validatorsMock.validatorsCountersResponse, { pathParams: { chainType } });

  const component = await render(<Validators/>);

  await expect(component).toHaveScreenshot();
});
