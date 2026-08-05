import React from 'react';

import { TabsRoot } from 'src/toolkit/chakra/tabs';

import { test, expect } from 'playwright/lib';

import TimePicker from './TimePicker';

test('default +@dark-mode', async({ render }) => {
  const component = await render(<TabsRoot defaultValue="time-picker"><TimePicker/></TabsRoot>);
  await expect(component).toHaveScreenshot();
});
