import React from 'react';

import { mudWorlds } from 'src/features/chain-variants/mud/mocks/mud-worlds';

import { test, expect } from 'playwright/lib';

import MudWorlds from './MudWorlds';

test('default view +@mobile', async({ mockTextAd, mockApiResponse, render }) => {
  await mockTextAd();
  await mockApiResponse('core:mud_worlds', mudWorlds);
  const component = await render(<MudWorlds/>);
  await expect(component).toHaveScreenshot();
});
