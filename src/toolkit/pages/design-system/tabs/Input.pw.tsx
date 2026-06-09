import React from 'react';

import { TabsRoot } from 'src/toolkit/chakra/tabs';

import { test, expect } from 'playwright/lib';

import Input from './Input';

test('default', async({ render }) => {
  const component = await render(<TabsRoot defaultValue="input"><Input/></TabsRoot>);
  await expect(component).toHaveScreenshot();
});
