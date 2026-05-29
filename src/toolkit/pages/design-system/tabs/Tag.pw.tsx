import React from 'react';

import { TabsRoot } from 'src/toolkit/chakra/tabs';

import { test, expect } from 'playwright/lib';

import Tag from './Tag';

test('default +@dark-mode', async({ render }) => {
  const component = await render(<TabsRoot defaultValue="tag"><Tag/></TabsRoot>);
  await expect(component).toHaveScreenshot();
});
