import React from 'react';

import { TabsRoot } from 'src/toolkit/chakra/tabs';

import { test, expect } from 'playwright/lib';

import Values from './Values';

test('default', async({ render }) => {
  const component = await render(<TabsRoot defaultValue="values"><Values/></TabsRoot>);
  await expect(component).toHaveScreenshot();
});
