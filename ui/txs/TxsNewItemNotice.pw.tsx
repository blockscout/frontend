import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import { ROUTES } from 'lib/link/routes';
import TestApp from 'playwright/TestApp';

import TxsNewItemNotice from './TxsNewItemNotice';

const hooksConfig = {
  router: {
    pathname: ROUTES.txs.pattern,
    query: {},
  },
};

test('2 new items in validated txs list +@dark-mode', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <TxsNewItemNotice url="/" num={ 2 }/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();
});

test('connection loss', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <TxsNewItemNotice url="/" alert="Connection is lost. Please reload the page."/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();
});

test('fetching', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <TxsNewItemNotice url="/"/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();
});
