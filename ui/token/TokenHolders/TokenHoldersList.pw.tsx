import { test, expect, devices } from '@playwright/experimental-ct-react';
import React from 'react';

import { tokenHolders } from 'mocks/tokens/tokenHolders';
import { tokenInfo } from 'mocks/tokens/tokenInfo';
import TestApp from 'playwright/TestApp';

import TokenHoldersList from './TokenHoldersList';

test.use({ viewport: devices['iPhone 13 Pro'].viewport });

test('base view', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <TokenHoldersList data={ tokenHolders.items } token={ tokenInfo }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
