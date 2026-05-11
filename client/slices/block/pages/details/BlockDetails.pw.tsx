import React from 'react';

import type { BlockQuery } from 'client/slices/block/hooks/useBlockQuery';
import * as blockMock from 'client/slices/block/mocks/block';

import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import BlockDetails from './BlockDetails';

const hooksConfig = {
  router: {
    query: { height: '1' },
  },
};

test('regular block +@mobile +@dark-mode', async({ render, page }) => {
  const query = {
    data: blockMock.base,
    isPending: false,
  } as BlockQuery;

  const component = await render(<BlockDetails query={ query }/>, { hooksConfig });

  await page.getByText('View details').click();

  await expect(component).toHaveScreenshot();
});

test('genesis block', async({ render, page }) => {
  const query = {
    data: blockMock.genesis,
    isPending: false,
  } as BlockQuery;

  const component = await render(<BlockDetails query={ query }/>, { hooksConfig });

  await page.getByText('View details').click();

  await expect(component).toHaveScreenshot();
});

test('with blob txs', async({ render, page, mockEnvs }) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_DATA_AVAILABILITY_ENABLED', 'true' ],
  ]);
  const query = {
    data: blockMock.withBlobTxs,
    isPending: false,
  } as BlockQuery;

  const component = await render(<BlockDetails query={ query }/>, { hooksConfig });

  await page.getByText('View details').click();

  await expect(component).toHaveScreenshot();
});

test('rootstock custom fields', async({ render, page, mockEnvs }) => {
  await mockEnvs(ENVS_MAP.blockHiddenFields);
  const query = {
    data: blockMock.rootstock,
    isPending: false,
  } as BlockQuery;

  const component = await render(<BlockDetails query={ query }/>, { hooksConfig });

  await page.getByText('View details').click();

  await expect(component).toHaveScreenshot();
});
