import React from 'react';

import { TabsRoot } from 'src/toolkit/chakra/tabs';

import { test, expect } from 'playwright/lib';

import { TOKEN } from './Link';
import Values from './Values';

test('default', async({ render, mockAssetResponse }) => {
  await mockAssetResponse(TOKEN.icon_url!, './playwright/mocks/duck.png');
  const component = await render(<TabsRoot defaultValue="values"><Values/></TabsRoot>);
  await expect(component).toHaveScreenshot();
});
