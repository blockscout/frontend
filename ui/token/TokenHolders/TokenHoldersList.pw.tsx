import { test, expect, devices } from '@playwright/experimental-ct-react';
import React from 'react';

import { tokenHoldersERC20, tokenHoldersERC1155 } from 'mocks/tokens/tokenHolders';
import { tokenInfo, tokenInfoERC1155a } from 'mocks/tokens/tokenInfo';
import TestApp from 'playwright/TestApp';

import TokenHoldersList from './TokenHoldersList';

test.use({ viewport: devices['iPhone 13 Pro'].viewport });

test('base view without IDs', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <TokenHoldersList data={ tokenHoldersERC20.items } token={ tokenInfo }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('base view with IDs', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <TokenHoldersList data={ tokenHoldersERC1155.items } token={ tokenInfoERC1155a }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
