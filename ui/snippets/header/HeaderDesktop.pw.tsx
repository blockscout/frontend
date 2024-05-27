import React from 'react';

import { test, expect } from 'playwright/lib';

import HeaderDesktop from './HeaderDesktop';

test('default view +@dark-mode', async({ render }) => {
  const component = await render(<HeaderDesktop/>);
  await expect(component).toHaveScreenshot();
});
