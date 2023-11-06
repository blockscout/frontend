import { Box } from '@chakra-ui/react';
import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import { tokenHoldersERC20, tokenHoldersERC1155 } from 'mocks/tokens/tokenHolders';
import { tokenInfo, tokenInfoERC1155a } from 'mocks/tokens/tokenInfo';
import TestApp from 'playwright/TestApp';

import TokenHoldersTable from './TokenHoldersTable';

test('base view without IDs', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <Box h="128px"/>
      <TokenHoldersTable data={ tokenHoldersERC20.items } token={ tokenInfo } top={ 80 }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('base view with IDs', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <Box h="128px"/>
      <TokenHoldersTable data={ tokenHoldersERC1155.items } token={ tokenInfoERC1155a } top={ 80 }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
