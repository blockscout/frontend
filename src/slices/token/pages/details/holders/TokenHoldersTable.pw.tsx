import { Box } from '@chakra-ui/react';

import { tokenHoldersERC1155, tokenHoldersERC20 } from 'src/slices/token/mocks/holders';
import { tokenInfoERC1155a, tokenInfoERC8056 } from 'src/slices/token/mocks/info';

import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { expect, test } from 'playwright/lib';

import TokenHoldersTable from './TokenHoldersTable';

test('base view without IDs', async({ render, mockEnvs }) => {
  await mockEnvs(ENVS_MAP.additionalTokenTypes);

  const component = await render(
    <Box pt="128px">
      <TokenHoldersTable data={ tokenHoldersERC20.items } token={ tokenInfoERC8056 } top={ 88 }/>
    </Box>,
  );

  await expect(component).toHaveScreenshot();
});

test('base view with IDs', async({ render }) => {
  const component = await render(
    <Box pt="128px">
      <TokenHoldersTable data={ tokenHoldersERC1155.items } token={ tokenInfoERC1155a } top={ 88 }/>
    </Box>,
  );

  await expect(component).toHaveScreenshot();
});
