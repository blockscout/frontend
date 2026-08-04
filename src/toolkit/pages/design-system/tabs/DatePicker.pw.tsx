import React from 'react';

import { TabsRoot } from 'src/toolkit/chakra/tabs';

import { test, expect } from 'playwright/lib';

import DatePicker from './DatePicker';

test('default +@dark-mode', async({ render }) => {
  const component = await render(<TabsRoot defaultValue="date-picker"><DatePicker/></TabsRoot>);
  await expect(component).toHaveScreenshot();
  await component.locator('input[name="date_of_birth"]').click();
  await expect(component).toHaveScreenshot();
});
