import React from 'react';

import { TabsRoot } from 'src/toolkit/chakra/tabs';

import { test, expect } from 'playwright/lib';

import Alert from './Alert';

test('default +@dark-mode', async({ render }) => {
  const component = await render(<TabsRoot defaultValue="alert"><Alert/></TabsRoot>);
  await expect(component).toHaveScreenshot();
});
