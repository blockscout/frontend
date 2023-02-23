import { test, expect } from '@playwright/experimental-ct-react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { Block } from 'types/api/block';

import type { ResourceError } from 'lib/api/resources';
import * as blockMock from 'mocks/blocks/block';
import TestApp from 'playwright/TestApp';

import BlockDetails from './BlockDetails';

const hooksConfig = {
  router: {
    query: { height: '1' },
  },
};

test('regular block +@mobile +@dark-mode', async({ mount, page }) => {
  const query = {
    data: blockMock.base,
    isLoading: false,
  } as UseQueryResult<Block, ResourceError>;

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
    isLoading: false,
  } as UseQueryResult<Block, ResourceError>;

  const component = await mount(
    <TestApp>
      <BlockDetails query={ query }/>
    </TestApp>,
    { hooksConfig },
  );

  await page.getByText('View details').click();

  await expect(component).toHaveScreenshot();
});
