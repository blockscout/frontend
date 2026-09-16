import React from 'react';

import { tokenHoldersERC20, tokenHoldersERC1155 } from 'src/slices/token/mocks/holders';
import { tokenInfoERC1155a, tokenInfoERC8056 } from 'src/slices/token/mocks/info';

import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect, devices } from 'playwright/lib';

import TokenHoldersList from './TokenHoldersList';

test.use({ viewport: devices['iPhone 13 Pro'].viewport });

test('base view without IDs', async({ render, mockEnvs }) => {
  await mockEnvs(ENVS_MAP.additionalTokenTypes);
  const component = await render(<TokenHoldersList data={ tokenHoldersERC20.items } token={ tokenInfoERC8056 }/>);
  await expect(component).toHaveScreenshot();
});

test('base view with IDs', async({ render }) => {
  const component = await render(<TokenHoldersList data={ tokenHoldersERC1155.items } token={ tokenInfoERC1155a }/>);
  await expect(component).toHaveScreenshot();
});
