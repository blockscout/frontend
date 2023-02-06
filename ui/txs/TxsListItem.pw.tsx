import { test, expect, devices } from '@playwright/experimental-ct-react';
import React from 'react';

import * as txMock from 'mocks/txs/tx';
import TestApp from 'playwright/TestApp';

import TxsListItem from './TxsListItem';

test.use({ viewport: devices['iPhone 13 Pro'].viewport });

test('base view +@dark-mode', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <TxsListItem tx={ txMock.base } showBlockInfo/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('with base address', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <TxsListItem tx={ txMock.base } showBlockInfo currentAddress={ txMock.base.from.hash }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
