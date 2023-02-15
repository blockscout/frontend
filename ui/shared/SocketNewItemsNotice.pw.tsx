import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';

import SocketNewItemsNotice from './SocketNewItemsNotice';

const hooksConfig = {
  router: {
    pathname: '/tx/[hash]',
    query: {},
  },
};

test('2 new items in validated txs list +@dark-mode', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <SocketNewItemsNotice url="/" num={ 2 }/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();
});

test('connection loss', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <SocketNewItemsNotice url="/" alert="Connection is lost. Please reload the page."/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();
});

test('fetching', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <SocketNewItemsNotice url="/"/>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();
});
