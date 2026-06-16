import React from 'react';

import * as addressParamMocks from 'src/slices/address/mocks/address-param';
import * as logMocks from 'src/slices/log/mocks/log';

import { test, expect } from 'playwright/lib';

import LogItem from './LogItem';

test('with decoded input data +@mobile +@dark-mode', async({ render }) => {
  const component = await render(
    <LogItem
      type="transaction"
      data={{
        ...logMocks.base,
        address: { ...addressParamMocks.withName, is_verified: true },
      }}
    />,
  );
  await expect(component).toHaveScreenshot();
});

test('without decoded input data +@mobile', async({ render }) => {
  const component = await render(
    <LogItem
      type="transaction"
      data={{
        ...logMocks.base,
        decoded: null,
        address: addressParamMocks.withoutName,
        block_timestamp: null,
      }}

    />,
  );
  await expect(component).toHaveScreenshot();
});

test('with default data type', async({ render }) => {
  const component = await render(
    <LogItem
      type="address"
      data={{
        ...logMocks.base,
        decoded: null,
        address: addressParamMocks.withoutName,
        data: '0x6475636b',
        block_timestamp: '2022-02-02T12:00:00Z',
        transaction_hash: '0x404bd417203769f968aacb1d66211510db86b81303b0c68283b4eb4572e6845c',
      }}
      defaultDataType="UTF-8"
    />,
  );
  await expect(component).toHaveScreenshot();
});
