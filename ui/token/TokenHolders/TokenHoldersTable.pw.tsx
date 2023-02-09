import { Box } from '@chakra-ui/react';
import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import { tokenHolders } from 'mocks/tokens/tokenHolders';
import { tokenInfo } from 'mocks/tokens/tokenInfo';
import TestApp from 'playwright/TestApp';

import TokenHoldersTable from './TokenHoldersTable';

test('base view', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <Box h="128px"/>
      <TokenHoldersTable data={ tokenHolders.items } token={ tokenInfo } top={ 80 }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
