import React from 'react';

import { TabsRoot } from 'src/toolkit/chakra/tabs';

import { test, expect } from 'playwright/lib';

import Field from './Field';

test('default +@dark-mode', async({ render }) => {
  const component = await render(<TabsRoot defaultValue="field"><Field/></TabsRoot>);
  await expect(component).toHaveScreenshot();
});
