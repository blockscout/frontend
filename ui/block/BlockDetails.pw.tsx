import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as blockMock from 'mocks/blocks/block';
import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import TestApp from 'playwright/TestApp';
import * as configs from 'playwright/utils/configs';

import BlockDetails from './BlockDetails';
import type { BlockQuery } from './useBlockQuery';

const hooksConfig = {
  router: {
    query: { height: '1' },
  },
};

test('regular block +@mobile +@dark-mode', async({ mount, page }) => {
  const query = {
    data: blockMock.base,
    isPending: false,
  } as BlockQuery;

  const component = await mount(
    <TestApp>
      <BlockDetails query={ query }/>
    </TestApp>,
    { hooksConfig },
  );

  await page.getByText('View details').click();

  await expect(component).toHaveScreenshot();
});

test('genesis block', async({ mount, page }) => {
  const query = {
    data: blockMock.genesis,
    isPending: false,
  } as BlockQuery;

  const component = await mount(
    <TestApp>
      <BlockDetails query={ query }/>
    </TestApp>,
    { hooksConfig },
  );

  await page.getByText('View details').click();

  await expect(component).toHaveScreenshot();
});

const customFieldsTest = test.extend({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: contextWithEnvs(configs.viewsEnvs.block.hiddenFields) as any,
});

customFieldsTest('rootstock custom fields', async({ mount, page }) => {
  const query = {
    data: blockMock.rootstock,
    isPending: false,
  } as BlockQuery;

  const component = await mount(
    <TestApp>
      <BlockDetails query={ query }/>
    </TestApp>,
    { hooksConfig },
  );

  await page.getByText('View details').click();

  await expect(component).toHaveScreenshot();
});
