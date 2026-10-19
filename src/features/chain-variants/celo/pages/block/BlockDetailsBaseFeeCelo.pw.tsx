import { Grid } from '@chakra-ui/react';
import React from 'react';

import type { BlockBaseFeeCelo } from 'src/features/chain-variants/celo/types/api';

import * as blockMock from 'src/slices/block/mocks/details';
import * as tokenMock from 'src/slices/token/mocks/info';

import { test, expect } from 'playwright/lib';

import BlockDetailsBaseFeeCelo from './BlockDetailsBaseFeeCelo';

test('base view +@mobile', async({ render, mockAssetResponse }) => {
  await mockAssetResponse(tokenMock.tokenInfoERC20a.icon_url as string, './playwright/mocks/image_s.jpg');
  const component = await render(
    <Grid
      columnGap={ 8 }
      rowGap={{ base: 3, lg: 3 }}
      templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(min-content, 200px) minmax(0, 1fr)' }}
      overflow="hidden"
    >
      <BlockDetailsBaseFeeCelo data={ blockMock.celo.celo?.base_fee as BlockBaseFeeCelo }/>
    </Grid>,
  );
  await expect(component).toHaveScreenshot();
});
