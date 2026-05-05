import React from 'react';

import { test, expect } from 'playwright/lib';
import { TabsRoot } from 'toolkit/chakra/tabs';

import Input from './Input';

test('default', async({ render }) => {
  const component = await render(<TabsRoot defaultValue="input"><Input/></TabsRoot>);
  await expect(component).toHaveScreenshot();
});
