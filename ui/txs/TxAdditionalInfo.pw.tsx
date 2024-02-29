import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as txMock from 'mocks/txs/tx';
import TestApp from 'playwright/TestApp';

import TxAdditionalInfo from './TxAdditionalInfo';

test('regular transaction +@dark-mode', async({ mount, page }) => {
  const component = await mount(
    <TestApp>
      <TxAdditionalInfo tx={ txMock.base }/>
    </TestApp>,
  );

  await component.getByLabel('Transaction info').click();

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 400, height: 600 } });
});

test('regular transaction +@mobile -@default', async({ mount, page }) => {
  const component = await mount(
    <TestApp>
      <TxAdditionalInfo tx={ txMock.base } isMobile/>
    </TestApp>,
  );

  await component.getByLabel('Transaction info').click();

  await expect(page).toHaveScreenshot();
});

test('blob transaction', async({ mount, page }) => {
  const component = await mount(
    <TestApp>
      <TxAdditionalInfo tx={ txMock.withBlob }/>
    </TestApp>,
  );

  await component.getByLabel('Transaction info').click();

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 400, height: 600 } });
});
